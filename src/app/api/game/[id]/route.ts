import { NextRequest } from 'next/server';
import { generateBattleOrder, generatePlayerGenerals } from 'src/lib/game/generation';
import { calcConnectedStats,generateCard } from 'src/lib/game/cardUtils';
import { rotateArray, shuffle } from '@utils/helpers';
import prisma from '@prisma/prismaClient';
import { cards } from '@data/cards';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { BattleData, LobbyData, PlayerData, PopulatedCardData } from '@data/types';
import { drawBasicCard, sendDeadToGraveyard } from 'src/lib/game/gameplay';
import { findGameById, findUserById,findPlayerById, findCardById, findHeroShopCards, updateCards } from '@app/api/requests';
import { addActiveConnections, checkValidBoard, validatePayment, validatePlayerCards } from '@lib/game/gameLogic';
import { JsonValue } from '@prisma/client/runtime/library';
import { UserType } from '@app/api/types';

export const createGame = async (lobby: LobbyData) => {
  try {
    const playerGenerals = generatePlayerGenerals(lobby.players.length).map(arr => arr.map(genId => generateCard(cards.general[genId])));
    const heroDeck:number[] = shuffle(cards.hero).map(c => c.id);
    const heroShop = heroDeck.splice(0,3)
      .map(cardId => generateCard(cards.hero[cardId]))
      .map(c => ({ ...c, inHeroShop: true }))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ id, ...card }) => card);
    
    const battleDistribution = 15;
    const battleCount = 1;
    const battleOrder = generateBattleOrder(battleCount,battleDistribution);

// Create Game in DB
    const game = await prisma.game.create({
      data: {
        name: `Game for ${lobby.name}`,
        hostId: lobby.hostId, 
        turn: 1,
        heroDeck,
        battleOrder,
        lobbyId: lobby.id
      },
    });

// Create Players
    const players = await prisma.player.createManyAndReturn({
      data: lobby.players.map(p => (
        {
          userId: p.id,
          gameId: game.id,
        }
      ))
    });

// Set TurnOrder with player Ids
    await prisma.game.update({
      where: { id: game.id },
      data: {
        turnOrder: shuffle(players).map(p => p.id), 
      }
    })

// Create first Shop Cards and Generals
    await prisma.card.createMany({
      data: [
        ...heroShop,
        ...players
          .map((player,i) => 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            playerGenerals[i].map(({id, ...genCard}) => ({ ...genCard, playerId: player.id, isGeneralSelection: true })))
          .flat(),
      ],
    });

    return game;
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const getGame = async (id: string) => {
  try {
    // Fetch the game by its ID, including related players and playerData
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) },
      include: {
        players: true,  // Include player details in the response
      },
    });

    if (!game) {
      return { message: "Game not found", status: 404 };
    }

    const shopCards = await findHeroShopCards();
    return { message: "Successfully fetched game", data: { game: { heroShop: shopCards, ...game } }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

interface UpdateData {
  generalCard: PopulatedCardData;
  uid: string;
  space: {
    x?: number;
    y?: number;
    hand?: boolean;
  }
  playerData: PlayerData;
  payment: string[];
  card: PopulatedCardData;

  cards: PopulatedCardData[];
  buyCardId: number;
  paymentCardIds: number[];
  
  battle: {
    selectedCardUid: string;
    targetCardUid: string;
    abilityId: string;
  }
}

interface GameUpdates {
  turnOrder?: number[];
  heroShop?: string;
  discardPile?: string;
  battles?: JsonValue[];
}

const manageTurns = async (id: string) => {
  try {
    const game = await findGameById(parseInt(id));
    if (!game) return console.warn("Game Not Found");
    const { players } = game;
    const allPlayersEndedTurn = players.reduce((acc, cur) => acc&&cur.turnEnded,true);
    if (!allPlayersEndedTurn) return;

    // Update all players to turnEnded = false;
    await prisma.player.updateMany({
      where: { 
        id: {
          in: players.map(p => p.id),
        },
      },
      data: {
        turnEnded: false,
      },
    });

    const heroShop = await findHeroShopCards();
    const newHeroShopCards:PopulatedCardData[] = [];
    for (let i = heroShop.length; i<3; i++) {
      newHeroShopCards.push(generateCard(cards.hero[game.heroDeck[newHeroShopCards.length]]));
    }

    // Add new shop cards
    await prisma.card.createMany({
      data: newHeroShopCards,
    })

    const battling = game.battleOrder.includes(game.turn+1);
    // const battles = await prisma.battle.findMany({
    //   where: {
    //     id: {
    //       in: game.battles.map(b => b.id),
    //     },
    //   },
    // });

    if (battling) {
      // START BATTLE
    }

    await prisma.game.update({
      where: { id: game.id },
      data: {
        turn: game.turn+1,
        heroDeck: game.heroDeck.slice(1),
        battling,
      }
    });
    
  } catch {
    console.warn("Error managing turns");
  }
}

const updateGame = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const gameData = await findGameById(parseInt(id));
    if (!gameData) return { message: "Game not found", status: 404 };
    const gameUpdates:GameUpdates = {};
    const userData = await findUserById(user.id);
    if (!userData) return { message: "User Data not found", status: 404 };

    const playerData = await findPlayerById(userData.player?.id);
    if (!playerData) return { message: "Player Data not found", status: 404 };

    const isYourTurn = playerData.id===gameData.turnOrder[0];
    const hasEndedTurn = playerData.turnEnded;
    
    switch (action) {
      case "selectGeneral":
        if (playerData.generalSelected) return { message: "Already Selected General", status: 401 };

        const updatedGeneralCard = await findCardById(data.generalCard.id);
        if (!updatedGeneralCard) return { message: "Updated General Card not found", status: 404 };
        
        // Update General Card
        await prisma.card.update({
          where: { id: updatedGeneralCard.id },
          data: {
            x: 6,
            y: 6,
            playerId: playerData.id
          },
        });

        // Discard unselected generals
        await prisma.card.updateMany({
          where: {
            id: {
              not: updatedGeneralCard.id
            },
            playerId: playerData.id,
            isGeneralSelection: true,
          },
          data: {
            inDiscardPile: true,
          },
        })

        // Create Starting Cards
        await prisma.card.createMany({
          data: [
            { ...drawBasicCard(), playerId: playerData.id },
            { ...drawBasicCard(), playerId: playerData.id },
            { ...drawBasicCard(), playerId: playerData.id }
          ]
        });

        // Run any "onGeneralSelection" abilities
        if (updatedGeneralCard.ability=="Royal Wealth") {
          await prisma.card.createMany({
            data: [
              { ...drawBasicCard(), playerId: playerData.id },
              { ...drawBasicCard(), playerId: playerData.id }
            ]
          });
        }

        // Update Player Data
        await prisma.player.update({
          where: { id: playerData.id },
          data: {
            generalSelected: true,
          },
        });

        break;
      case "endTurn":
        // Check if a battle is happening
        if (gameData.battling) return { message: "Battle in progress", status: 401 };
        // Check if it is their turn
        if (!isYourTurn||hasEndedTurn) return { message: "It is not your turn", status: 401 };
        // Validate that the data has not been tampered with
        if (!validatePlayerCards(playerData.cards as PopulatedCardData[], data.cards)) return { message: "Data mismatch with server", status: 405 };
        // Check that board is valid
        const { success, error } = checkValidBoard(data.cards.filter(c => !c.inHand && !c.inDiscardPile));
        if (!success) return { message: error||"An unknown Validation error occurred", status: 405 };
        // Add Active Connections
        data.cards = addActiveConnections(data.cards);
        await updateCards(data.cards);
        // Draw a Card
        await prisma.card.createMany({
          data: [
            { ...drawBasicCard(), playerId: playerData.id },
          ],
        });
        // Set turnEnded
        await prisma.player.update({
          where: { id: playerData.id },
          data: { turnEnded: true, },
        });
        // Update TurnOrder
        await prisma.game.update({
          where: { id: gameData.id },
          data: { turnOrder: rotateArray(gameData.turnOrder) },
        });
        break;
      case "drawCard": // For Testing
        // Check if a battle is happening
        if (gameData.battling) return { message: "Battle in progress", status: 401 };
        // Check if it is their turn
        await prisma.card.createMany({
          data: [
            { ...drawBasicCard(), playerId: playerData.id },
          ],
        });
        break;
      case "buyCard":
        // Check if a battle is happening
        if (gameData.battling) return { message: "Battle in progress", status: 401 };
        if (!isYourTurn||hasEndedTurn) return { message: "It is not your turn", status: 401 };
        // Fetch Buy Card data
        const buyCard = await findCardById(data.buyCardId) as PopulatedCardData;
        if (!buyCard || !buyCard.inHeroShop) return { message: "Buy Card not in shop", status: 401 };
        // Fetch Payment Card data
        const paymentCards = await prisma.card.findMany({
          where: { 
            id: {
              in: data.paymentCardIds,
            }
          },
        }) as PopulatedCardData[];
        if (!paymentCards || paymentCards.length !== buyCard.cost.length) return { message: "Invalid Payment", status: 401 };
        // Check payment validity
        const isValid = validatePayment(buyCard, paymentCards).success;
        if (!isValid) return { message: "Invalid payment", status: 401 };
        // Successfuly take payment
        await prisma.card.updateMany({
          where: {
            id: {
              in: paymentCards.map(c => c.id),
            },
          },
          data: {
            inDiscardPile: true,
            inHand: false,
          },
        });
        // Add BuyCard to player's hand
        await prisma.card.update({
          where: { id: buyCard.id },
          data: {
            playerId: playerData.id,
            inHeroShop: false,
            inHand: true,
          },
        });
        break;
      case "battle-attack":
        // Check if a battle is happening
        if (!gameData.battling) return { message: "No Battle in progress", status: 401 };
        const { selectedCardUid, targetCardUid } = data.battle;
        // Verify the required data is provided
        if (!selectedCardUid || !targetCardUid) return { message: "Invalid Data", status: 401 };
        // Get Battle Data
        let currentBattleIndex = 0;
        gameData.battleOrder.forEach((item,i) => {if (item === gameData.turn) currentBattleIndex = i})
        const currentBattle = JSON.parse(gameData.battles[currentBattleIndex] as string) as BattleData;
        if (!currentBattle) return { message: "Battle Not found", status: 401 };
        let currentPlayerIndex = 0;
        const currentPlayerData = JSON.parse(gameData.players.filter((p,i) => { if (p.id===playerData.player) {currentPlayerIndex=i; return true} return false })[0].gameData as string) as PlayerData;
        let oponentPlayerIndex = 0;
        const oponentId = currentBattle.players.filter((p,i) => { if (p.id!==user.id) {oponentPlayerIndex=i; return true} return false })[0]?.id;
        if (!oponentId) return { message: "Oponent not found", status: 401 };
        if (currentPlayerIndex===oponentPlayerIndex) return { message: "Error finding players", status: 401 };
        const oponentData = JSON.parse(gameData.players.filter(p => p.id===oponentId)[0].gameData as string) as PlayerData;
        // Check that it is this user's turn in the battle
        if (currentBattle.turnOrder[0]!==user.id) return { message: "It is not your turn", status: 401 };
        // Validate that selected card can attack
        const selectedCard = currentPlayerData.cards.filter(c => c.card.uid === selectedCardUid)[0];
        if (!selectedCard) return { message: "Selected Card not found", status: 401 };
        if (selectedCard.card.atk < 1 || selectedCard.hand) return { message: "Selected Card cannot attack", status: 401 };
        // Validate that the target card can be attacked
        const targetCard = oponentData.cards.filter(c => c.card.uid === targetCardUid)[0];
        if (!targetCard || targetCard.card.hp < 1) return { message: "Target Card cannot be attacked", status: 401 };
        // Calculate Connection Bonuses 
        const { newAtk: selectedNewAtk } = calcConnectedStats(selectedCard.card);
        const { newHp: targetNewHp } = calcConnectedStats(targetCard.card);
        // Update Cards for both Players
        currentPlayerData.cards = currentPlayerData.cards.map(cardData => {
          if (cardData.card.uid === selectedCard.card.uid) {
            cardData.card.hp = cardData.card.hp - targetCard.card.atk;
          }
          return cardData;
        });

        oponentData.cards = oponentData.cards.map(cardData => {
          if (cardData.card.uid === targetCard.card.uid) {
            cardData.card.hp = (targetNewHp || targetCard.card.hp) - (selectedNewAtk || selectedCard.card.atk);
          }
          return cardData;
        });
        // Update battle data with both players
        const { playerData: finalCurrentPlayerData, graveyard } = sendDeadToGraveyard(currentPlayerData, currentBattle.graveyard);
        const { playerData: finalOponentData, graveyard: finalGraveyard } = sendDeadToGraveyard(currentPlayerData, graveyard);
        currentBattle.players[currentPlayerIndex].gameData = finalCurrentPlayerData;
        currentBattle.players[oponentPlayerIndex].gameData = finalOponentData;
        currentBattle.graveyard = finalGraveyard;
        game.battles[currentBattleIndex] = JSON.stringify(currentBattle);

        gameUpdates.battles = game.battles;
        break;
      case "battle-cast":
        // Check if a battle is happening
        if (!game.battling) return { message: "No Battle in progress", status: 401 };
        break;
      default:
        return { message: "Invalid action", status: 400 };
    }
    manageTurns(id);
    return { message: "Successfully updated game", status: 201 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const deleteGame = async (user: UserType, id: string) => {
  try {
    await prisma.game.delete({
      where: { id: Number(id) },
    });
    return { message: "Game deleted", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { id } = params;
  const response = await getGame(id);
  return handleResponse(response);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { action, data } = await req.json();
  const { id } = params;
  const response = await updateGame(user, id, action, data);
  return handleResponse(response);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { id } = params;
  const response = await deleteGame(user, id);
  return handleResponse(response);
}