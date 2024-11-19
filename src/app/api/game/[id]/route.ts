import { NextRequest } from 'next/server';
import { generateBattle, generateBattleOrder, generatePlayerGenerals } from 'src/lib/game/generation';
import { generateCard } from 'src/lib/game/cardUtils';
import { rotateArray, shuffle } from '@utils/helpers';
import prisma from '@prisma/prismaClient';
import { LobbyType, UserType } from '@app/api/types';
import { cards } from '@data/cards';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { BoardType, CardObjectData, PlayerData, PopulatedCardData } from '@data/types';
import { drawBasicCard } from 'src/lib/game/gameplay';
import { findGameById, findUserById, updateUserById, updateGameById } from '@app/api/requests';
import { addActiveConnections, checkValidBoard, validatePayment, validatePlayerData } from '@lib/game/gameLogic';

export const createGame = async (lobby: LobbyType) => {
  try {
    const playerGenerals = generatePlayerGenerals(lobby.players.length).map(arr => arr.map(genId => generateCard(cards.general[genId])));
    const heroDeck:number[] = shuffle(cards.hero).map(c => c.id);
    const heroShop = heroDeck.splice(0,3).map(cardId => generateCard(cards.hero[cardId]));
    
    const battleDistribution = 15;
    const battleCount = 1;
    const battleOrder = generateBattleOrder(battleCount,battleDistribution);

    const game = await prisma.game.create({
      data: {
        name: `Game for ${lobby.name}`,
        players: { connect: lobby.players.map((player) => ({ id: player.id })) },
        host: lobby.host.toString(), 
        turn: 1,
        turnOrder: shuffle(lobby.players).map(p => p.id), 
        heroDeck,
        heroShop: JSON.stringify(heroShop),
        discardPile: JSON.stringify([]),
        battleOrder,
      },
    });
    lobby.players.forEach(async (player, i) => {
      await updateUserById(player.id, {
        gameData: JSON.stringify({
          player: player.id,
          generals: {
            selected: false,
            choices: playerGenerals[i],
          },
          cards: [],
          turnEnded: false,
        })
      })
    })

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
}

interface GameUpdates {
  turnOrder?: number[];
  heroShop?: string;
  discardPile?: string;
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
    const battles = game.battles ? JSON.parse(game.battles as string) : [];
    if (battling) battles.push(generateBattle(game));
    updateGameById(game.id,{ turn: game.turn+1, heroShop: JSON.stringify(heroShop), heroDeck: game.heroDeck, battling, battles: JSON.stringify(battles) });
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
        data.playerData.cards.push({card: drawBasicCard(), hand: true});
        playerData = data.playerData;
        break;
      case "buyCard":
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

