import { NextRequest } from 'next/server';
import prisma from '@prisma/prismaClient';
import { handleResponse } from '@utils/handleResponse';
import { nextErrorHandler } from '@utils/nextErrorHandler';
import { verifyToken } from 'src/lib/auth/verifyToken';
import { ApiResponse, UserType } from '@app/api/types';
// import { updateLobbyList } from '@lib/sockets/sockets';

const getAllLobbies = async () => {
  try {
    const lobbies = await prisma.lobby.findMany({
      where: { started: false },
      include: { 
        players: {
          select: {
            id: true,
            name: true,
          },
        }, 
      },
    });

    return { message: "Successfully fetched all lobbies", data: { lobbies: lobbies||[] }, status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const deleteAllLobbies = async () => {
  try {
    await prisma.lobby.deleteMany();

    // updateLobbyList();

    return { message: "All lobbies deleted", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const deleteStartedLobbies = async () => {
  try {
    await prisma.lobby.deleteMany({
      where: { started: true },
    });

    // updateLobbyList();

    return { message: "Started lobbies deleted", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const createLobby = async (user:UserType, name:string) => {
  try {
    // Check if the user is already in a lobby
    const userInLobby = await prisma.lobby.findFirst({
      where: { players: { some: { id: user.id } } },
    });

    if (userInLobby) {
      return { message: "User is already in a lobby", status: 400 };
    }

    // Create a new lobby and add the user
    const lobby = await prisma.lobby.create({
      data: {
        players: { connect: { id: user.id } },
        name,
        started: false,
        host: user.id,
        playerCount: 1,
      },
    });
    return { message: "Lobby created", data: { lobby } , status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function POST(req: NextRequest) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { action, name } = await req.json();
  let response: ApiResponse;

  switch (action) {
    case 'create':
      response = await createLobby(user, name);
      break;
    case 'deleteAll':
      response = await deleteAllLobbies();
      break;
    case 'deleteStarted':
      response = await deleteStartedLobbies();
      break;
    default:
      return { message: 'Invalid action', status: 400 };
  }
  return handleResponse(response);
}

export async function GET() {
  const response = await getAllLobbies();
  return handleResponse(response);
}