import { NextRequest, NextResponse } from 'next/server';
import prisma from "@prisma/prismaClient";
import { verifyToken } from '@app/lib/auth/verifyToken';
import { handleResponse } from '@utils/handleResponse';
import { nextErrorHandler } from '@utils/nextErrorHandler';

const createLobby = async (user, name) => {
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
      },
    });

    // updateLobbyList(io);

    return { message: "Lobby created", data: lobby , status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const joinLobby = async (user, id) => {

  try {
    // Check if the lobby exists
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
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
      where: { id: lobbyId },
      data: {
        players: { connect: { id: user.id } },
      },
    });

    // updateLobbyList(io);
    // updateLobbyData(io, lobbyId);

    return { message: "Joined lobby successfully", status: 200 };
  } catch (error: unknown) {
    nextErrorHandler(error);
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

const deleteLobby = async (id, user) => {
  try {
    await prisma.lobby.delete({
      where: { id: Number(id), host: user.id },
    });

    // updateLobbyList(io);

    return { message: "Lobby deleted", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await verifyToken(req);
  const { message, data, status } = await getLobby(id);
  if (status < 300) return NextResponse.json(data, { status });
  return NextResponse.json({ message }, { status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await verifyToken(req);
  const response = await deleteLobby(id, user);
  return handleResponse(response);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyToken(req);
  const { action, ...data } = await req.json();
  const { id } = params;

  let response;

  switch (action) {
    case 'create':
      response = await createLobby(user, data.name);
      break;
    case 'join':
      response = await joinLobby(user, id)
      break;
    case 'leave': // New leave lobby action
      response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/leave`, data, {
        headers: getAuthHeaders(req),
      });
      break;
    case 'start':
      response = await axios.post(`${EXPRESS_API_URL}/api/lobbies/start`, data, {
        headers: getAuthHeaders(req),
      });
      break;
    case 'deleteAll':
      response = await axios.delete(`${EXPRESS_API_URL}/api/lobbies`, {
        headers: getAuthHeaders(req),
      });
      break;
    case 'deleteStarted':
      response = await axios.delete(`${EXPRESS_API_URL}/api/lobbies/deleteStarted`, {
        headers: getAuthHeaders(req),
      });
      break;
    default:
      return response = { message: 'Invalid action' }, { status: 400 };
  }

  return handleResponse(response);
}