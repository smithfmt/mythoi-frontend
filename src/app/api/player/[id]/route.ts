import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';

const getPlayer = async (id: string) => {
    try {
      // Fetch the game by its ID, including related players and playerData
      const player = await prisma.player.findUnique({
        where: { id: parseInt(id) },
        include: {
          cards: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
  
      if (!player) {
        return { message: "Player not found", status: 404 };
      }
  
      return { message: "Successfully fetched player", data: { player }, status: 200 };
    } catch (error: unknown) {
      return nextErrorHandler(error);
    }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = await verifyToken(req);
    if (error) return handleResponse(error);
    const { id } = params;
    const response = await getPlayer(id);
    return handleResponse(response);
}