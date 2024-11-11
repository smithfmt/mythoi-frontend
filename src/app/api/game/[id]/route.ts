import { NextRequest } from 'next/server';
import { generatePlayerGenerals } from 'src/lib/game/generation';
import { generateCard } from 'src/lib/game/cardUtils';
import { findIndexByParam, shuffle } from '@utils/helpers';
import prisma from '@prisma/prismaClient';
import { LobbyType, UserType } from '@app/api/types';
import { cards } from '@data/cards';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { CardObjectData, PlayerData, PopulatedCardData } from '@data/types';
import { drawRandomCard } from 'src/lib/game/gameplay';
// import { updateGameData } from '@lib/sockets/sockets';

export const createGame = async (lobby: LobbyType) => {
  try {
    const playerIds = lobby.players.map((player) => player.id);
    const playerGenerals = generatePlayerGenerals(lobby.players.length).map(arr => arr.map(genId => generateCard(cards.general[genId])));
    const heroDeck:number[] = shuffle(Object.keys(cards.hero).map(str => parseInt(str)));
    const game = await prisma.game.create({
      data: {
        name: `Game for ${lobby.name}`,
        players: { connect: playerIds.map((id: number) => ({ id })) },
        host: lobby.host.toString(), 
        turn: lobby.players[0].id, 
        heroDeck,
        playerData: JSON.stringify(
          lobby.players.map((player, i) => ({
            player: player.id,
            generals: {
              selected: false,
              choices: playerGenerals[i],
            },
            cards: [],
            basicCount: 0,
          }))
        ),
      },
    });

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
}

const updateGame = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) },
    });

    if (!game) {
      return { message: "Game not found", status: 404 };
    }

    let updatedGame;
    const playerData: PlayerData[] = JSON.parse(game.playerData as string);

    const playerIndex = findIndexByParam(playerData,["player"], user.id);
    if (playerIndex===undefined) return { message: "Player not found", status: 404 };
    const currentPlayerData = playerData[playerIndex];
    
    switch (action) {
      case "selectGeneral":
        if (currentPlayerData.generals.selected) return { message: "Already Selected General", status: 401 };
        const { generalCard } = data;
        
        currentPlayerData.generals.selected = true;
        currentPlayerData.cards.push({
          card: generalCard, 
          x: 5,
          y: 5,
        });

        const startingCards:CardObjectData[] = [];
        for (let i=0;i<(generalCard.id===4?5:3);i++) {
          startingCards.push({card: generateCard(drawRandomCard()), hand: true})
        }
        currentPlayerData.cards = [...currentPlayerData.cards, ...startingCards]
        // Update the game with the modified playerData
        updatedGame = await prisma.game.update({
          where: { id: parseInt(id) },
          data: {
            playerData: JSON.stringify(playerData),  // Save the updated playerData back as JSON
          },
        });
        break;
      case "placeCard":
        const { uid, space } = data;
        const { x=null, y=null, hand } = space;

        const cardIndex = findIndexByParam(currentPlayerData.cards, ["card", "uid"], uid)
        if (cardIndex===undefined) return { message: "Card not found", status: 404 };
        const currentCard = currentPlayerData.cards[cardIndex];

        Object.assign(currentCard, { x, y, hand });

        updatedGame = await prisma.game.update({
          where: { id: parseInt(id) },
          data: {
            playerData: JSON.stringify(playerData),  // Save the updated playerData back as JSON
          },
        });
        break
      default:
        return { message: "Invalid action", status: 400 };
    }
    // updateGameData(parseInt(id))
    return { message: "Successfully updated game", data: { game: updatedGame }, status: 201 };
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


