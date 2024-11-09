import { verifyToken } from "@app/lib/auth/verifyToken";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import prisma from "@prisma/prismaClient";
import { NextRequest } from "next/server";
import { handleResponse } from "@utils/handleResponse";

const getAllGames = async () => {
  try {
    const games = await prisma.game.findMany({
      include: {
        players: {
          select: {
            id: true,
            name: true,
          }
        },
      },
    });

    return { message: "Successfully fetched games", data: { games }, status: 200};
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

const deleteAllGames = async () => {
  try {
    await prisma.game.deleteMany({});
    return { message: "All games deleted successfully", status: 200 };
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
};

export async function DELETE(req: NextRequest) {
  const { error } = await verifyToken(req);
  if (error) return handleResponse(error);
    const response = await deleteAllGames();
    return handleResponse(response);
}

export async function GET(req: NextRequest) {
  const { error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const response = await getAllGames();
  return handleResponse(response);
}
