import { NextRequest } from 'next/server';
import { generatePlayerGenerals } from 'src/lib/game/generation';
import { generateCard } from 'src/lib/game/cardUtils';
import { shuffle } from '@utils/helpers';
import prisma from '@prisma/prismaClient';
import { LobbyType, UserType } from '@app/api/types';
import { cards } from '@data/cards';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { BoardType, CardObjectData, PlayerData, PopulatedCardData } from '@data/types';
import { drawBasicCard } from 'src/lib/game/gameplay';
import { findGameById, findUserById, updateUserById } from '@app/api/requests';
import { addActiveConnections, checkValidBoard } from '@lib/game/gameLogic';
// import { updateGameData } from '@lib/sockets/sockets';

export const createGame = async (lobby: LobbyType) => {
  try {
    const playerGenerals = generatePlayerGenerals(lobby.players.length).map(arr => arr.map(genId => generateCard(cards.general[genId])));
    const heroDeck:number[] = shuffle(Object.keys(cards.hero).map(str => parseInt(str)));
    const game = await prisma.game.create({
      data: {
        name: `Game for ${lobby.name}`,
        players: { connect: lobby.players.map((player) => ({ id: player.id })) },
        host: lobby.host.toString(), 
        turn: lobby.players[0].id, 
        heroDeck,
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
          basicCount: 0,
        })
      })
    })

    return game;
  } catch (error) {
    console.error("Error creating game:", error);
    throw new Error("Error creating game");
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
}

const updateGame = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const game = await findGameById(parseInt(id));
    if (!game) return { message: "Game not found", status: 404 }

    const userData = await findUserById(user.id);
    if (!userData) return { message: "User Data not found", status: 404 }

    let playerData: PlayerData = JSON.parse(userData?.gameData as string);
    
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
        const { playerData: updatedPlayerData } = data;
        // Check that board is valid
        const { success, error } = checkValidBoard(updatedPlayerData.cards.filter(c => !c.hand) as BoardType);
        if (!success) return { message: error||"An unknown Validation error occurred", status: 405 };
        // Add Active Connections
        updatedPlayerData.cards = addActiveConnections(updatedPlayerData.cards);
        // Draw a Card
        updatedPlayerData.cards.push({card: drawBasicCard(), hand: true});
        playerData = updatedPlayerData;
        break;
      case "drawCard":
        const { playerData: updatedData } = data;
        updatedData.cards.push({card: drawBasicCard(), hand: true});
        playerData = updatedData;
        break;
      default:
        return { message: "Invalid action", status: 400 };
    }

    const updatedGameData = await updateUserById(user.id, { gameData: JSON.stringify(playerData) });

    return { message: "Successfully updated game", data: { gameData: updatedGameData }, status: 201 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

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


