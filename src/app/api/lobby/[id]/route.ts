import { NextRequest } from 'next/server';
import prisma from "@prisma/prismaClient";
import { verifyToken } from 'src/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { createGame } from '@app/api/game/[id]/route';
import { ApiResponse, UserType } from '@app/api/types';
import { updateGameList, updateLobbyData, updateLobbyList } from '@lib/sockets/sockets';



const joinLobby = async (user:UserType, id:string) => {

  try {
    // Check if the lobby exists
    const lobby = await prisma.lobby.findUnique({
      where: { id: parseInt(id) },
    });

    if (!lobby) {
      return { message: "Lobby not found", status: 400 };
    }

    // Check if the user is already in another lobby
    const userInLobby = await prisma.lobby.findFirst({
      where: { players: { some: { id: user.id } } },
    });

    if (userInLobby) {
      return { message: "User is already in a lobby", status: 400 };
    }

    // Add the user to the lobby
    await prisma.lobby.update({
      where: { id: parseInt(id) },
      data: {
        players: { connect: { id: user.id } },
      },
    });

    updateLobbyList();
    updateLobbyData(parseInt(id));

    return { message: "Joined lobby successfully", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const getLobby = async (id:string) => {
  try {
    const lobby = await prisma.lobby.findUnique({
      where: { id: Number(id) },
      include: { players: true },
    });

    if (!lobby) {
      return { message: "Lobby not found", status: 404 };
    }

    return { message: "Successfully fetched Lobby", data: { lobby }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const deleteLobby = async (user:UserType, id:string) => {
  try {
    await prisma.lobby.delete({
      where: { id: Number(id), host: user.id },
    });

    updateLobbyList();

    return { message: "Lobby deleted", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const leaveLobby = async (user:UserType, id:string) => {
  try {
    // Check if the user is in a lobby
    const userLobby = await prisma.lobby.findUnique({
      where: { id: parseInt(id) },
      include: { players: true },
    })

    if (!userLobby) return { message: "Lobby not found", status: 404 };

    if (!userLobby.players.filter(p => p.id===user.id).length) return { message: "User not in lobby", status: 404 };

    // Remove the user from the lobby
    await prisma.lobby.update({
      where: { id: userLobby.id },
      data: {
        players: {
          disconnect: { id: user.id },
        },
      },
    });


    if (userLobby.players.length===1) {
      await prisma.lobby.delete({
        where: { id: userLobby.id },
      });
    }

    updateLobbyList();
    updateLobbyData(parseInt(id));

    return { message: "Left the lobby successfully", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const startLobby = async (user:UserType, id:string) => {

  try {
    // Find and update the lobby to started
    const lobby = await prisma.lobby.update({
      where: { id: parseInt(id), players: { some: { id: user.id } } },
      include: { players: true },
      data: { started: true },
    });
    // Create the game using the players in the lobby
    const game = await createGame(lobby);  
    
    await updateLobbyData(lobby.id, game.id);

    // After creating the game, delete the lobby
    await prisma.lobby.delete({
      where: { id: parseInt(id) },
    });
    
    updateLobbyList();
    updateGameList();
    
    return { message: "Lobby started and game created", data: { game: game.id }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await verifyToken(req);
  const { id } = params;
  const response = await getLobby(id);
  return handleResponse(response);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const response = await deleteLobby(user, id);
  return handleResponse(response);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { action } = await req.json();
  const { id } = params;

  let response:ApiResponse;

  switch (action) {
    case 'join':
      response = await joinLobby(user, id);
      break;
    case 'leave': 
      response = await leaveLobby(user, id);
      break;
    case 'start':
      response = await startLobby(user, id);
      break;
    default:
      return response = { message: 'Invalid action', status: 400 };
  }

  return handleResponse(response);
}