import { NextRequest } from 'next/server';
import { generateBattle, generateBattleOrder, generatePlayerGenerals } from 'src/lib/game/generation';
import { calcConnectedStats, generateCard } from 'src/lib/game/cardUtils';
import { rotateArray, shuffle } from '@utils/helpers';
import prisma from '@prisma/prismaClient';
import { cards } from '@data/cards';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { BattleData, LobbyData, PlayerData, PopulatedCardData } from '@data/types';
import { drawBasicCard, sendDeadToGraveyard } from 'src/lib/game/gameplay';
import { findGameById, findUserById, updateUserById, updateGameById } from '@app/api/requests';
import { addActiveConnections, checkValidBoard, validatePayment, validatePlayerData } from '@lib/game/gameLogic';
import { JsonValue } from '@prisma/client/runtime/library';

export const createGame = async (lobby: LobbyData) => {
  try {
    const playerGenerals = generatePlayerGenerals(lobby.players.length).map(arr => arr.map(genId => generateCard(cards.general[genId])));
    const heroDeck:number[] = shuffle(cards.hero).map(c => c.id);
    const heroShop = heroDeck.splice(0,3).map(cardId => generateCard(cards.hero[cardId])).map(c => ({ ...c, inHeroShop: true }));
    
    const battleDistribution = 5;
    const battleCount = 1;
    const battleOrder = generateBattleOrder(battleCount,battleDistribution);

// Create Game in DB
    const game = await prisma.game.create({
      data: {
        name: `Game for ${lobby.name}`,
        hostId: lobby.hostId, 
        turn: 1,
        turnOrder: shuffle(lobby.players).map(p => p.id), 
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

    return { message: "Successfully fetched game", data: { game }, status: 200 };
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
    const players = game.players.map(p => JSON.parse(p.gameData as string)) as PlayerData[];
    const allPlayersEndedTurn = players.reduce((acc, cur) => acc&&cur.turnEnded,true);
    if (!allPlayersEndedTurn) return;
    players.forEach(async playerData => {
      await updateUserById(playerData.player, { gameData: JSON.stringify({...playerData, turnEnded: false}) });
    });
    const heroShop = JSON.parse(game.heroShop as string);
    while (heroShop.length<3) {
      heroShop.push(game.heroDeck.splice(0,1).map(cardId => generateCard(cards.hero[cardId]))[0]);
    }
    const battling = game.battleOrder.includes(game.turn+1);
    const battles = game.battles ? game.battles.map(b => JSON.parse(b as string) as BattleData) : [];
    if (battling) battles.push(generateBattle(game, players.map(p => p.player)));
    updateGameById(game.id,{ turn: game.turn+1, heroShop: JSON.stringify(heroShop), heroDeck: game.heroDeck, battling, battles: battles.map(b => JSON.stringify(b)) });
  } catch {
    console.warn("Error managing turns");
  }
}

const updateGame = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const game = await findGameById(parseInt(id));
    if (!game) return { message: "Game not found", status: 404 };
    const gameUpdates:GameUpdates = {};
    const userData = await findUserById(user.id);
    if (!userData) return { message: "User Data not found", status: 404 };

    let playerData: PlayerData = JSON.parse(userData?.gameData as string);
    const isYourTurn = userData.id===game.turnOrder[0];
    const hasEndedTurn = playerData.turnEnded;
    
    switch (action) {
      case "selectGeneral":
        if (playerData.generals.selected) return { message: "Already Selected General", status: 401 };
        const { generalCard } = data;
        
        playerData.generals.selected = true;
        playerData.cards.push({
          card: generalCard, 
          x: 5,
          y: 5,
        });

        const startingCards:CardObjectData[] = [];
        for (let i=0;i<(generalCard.id===4?5:3);i++) {
          startingCards.push({card: drawBasicCard(), hand: true});
        }
        playerData.cards = [...playerData.cards, ...startingCards];
        break;
      case "endTurn":
        // Check if a battle is happening
        if (game.battling) return { message: "Battle in progress", status: 401 };
        // Check if it is their turn
        if (!isYourTurn||hasEndedTurn) return { message: "It is not your turn", status: 401 };
        // Validate that the data has not been tampered with
        if (!validatePlayerData(playerData, data.playerData)) return { message: "Data mismatch with server", status: 405 };
        // Check that board is valid
        const { success, error } = checkValidBoard(data.playerData.cards.filter(c => !c.hand) as BoardType);
        if (!success) return { message: error||"An unknown Validation error occurred", status: 405 };
        // Add Active Connections
        data.playerData.cards = addActiveConnections(data.playerData.cards);
        // Draw a Card
        data.playerData.cards.push({card: drawBasicCard(), hand: true});
        // Set turnEnded
        data.playerData.turnEnded = true;
        gameUpdates.turnOrder = rotateArray(game.turnOrder);
        playerData = data.playerData;
        break;
      case "drawCard": // For Testing
        // Check if a battle is happening
        if (game.battling) return { message: "Battle in progress", status: 401 };
        // Check if it is their turn
        data.playerData.cards.push({card: drawBasicCard(), hand: true});
        playerData = data.playerData;
        break;
      case "buyCard":
        // Check if a battle is happening
        if (game.battling) return { message: "Battle in progress", status: 401 };
        if (!isYourTurn||hasEndedTurn) return { message: "It is not your turn", status: 401 };
        // Validate that the data has not been tampered with
        if (!validatePlayerData(playerData, data.playerData)) return { message: "Data mismatch with server", status: 405 };
        const heroShop = JSON.parse(game.heroShop as string) as PopulatedCardData[];
        const heroCard = heroShop.filter(c => c.uid===data.card.uid)[0];
        if (!heroCard) return { message: "Card not in shop", status: 401 };
        const paymentCards = playerData.cards.filter(cardObj => data.payment.includes(cardObj.card.uid)).map(cardObj => cardObj.card);
        const isValid = validatePayment(heroCard, paymentCards).success;
        if (!isValid) return { message: "Invalid payment", status: 401 };
        // Successfuly take payment and add the hero card
        gameUpdates.discardPile = JSON.stringify([...JSON.parse(game.discardPile as string), ...shuffle(paymentCards)]);
        data.playerData.cards = data.playerData.cards.filter(cardObj => !data.payment.includes(cardObj.card.uid));
        data.playerData.cards.push({ card:heroCard, hand:true });
        // Remove card from the shop
        gameUpdates.heroShop = JSON.stringify(heroShop.filter(c => c.uid!==heroCard.uid));
        playerData = data.playerData;
        break;
      case "battle-attack":
        // Check if a battle is happening
        if (!game.battling) return { message: "No Battle in progress", status: 401 };
        const { selectedCardUid, targetCardUid } = data.battle;
        // Verify the required data is provided
        if (!selectedCardUid || !targetCardUid) return { message: "Invalid Data", status: 401 };
        // Get Battle Data
        let currentBattleIndex = 0;
        game.battleOrder.forEach((item,i) => {if (item === game.turn) currentBattleIndex = i})
        const currentBattle = JSON.parse(game.battles[currentBattleIndex] as string) as BattleData;
        if (!currentBattle) return { message: "Battle Not found", status: 401 };
        let currentPlayerIndex = 0;
        const currentPlayerData = JSON.parse(game.players.filter((p,i) => { if (p.id===playerData.player) {currentPlayerIndex=i; return true} return false })[0].gameData as string) as PlayerData;
        let oponentPlayerIndex = 0;
        const oponentId = currentBattle.players.filter((p,i) => { if (p.id!==user.id) {oponentPlayerIndex=i; return true} return false })[0]?.id;
        if (!oponentId) return { message: "Oponent not found", status: 401 };
        if (currentPlayerIndex===oponentPlayerIndex) return { message: "Error finding players", status: 401 };
        const oponentData = JSON.parse(game.players.filter(p => p.id===oponentId)[0].gameData as string) as PlayerData;
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
    if (Object.keys(gameUpdates).length) await updateGameById(parseInt(id), gameUpdates)
    const updatedGameData = await updateUserById(user.id, { gameData: JSON.stringify(playerData) });
    manageTurns(id);
    return { message: "Successfully updated game", data: { gameData: updatedGameData }, status: 201 };
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

