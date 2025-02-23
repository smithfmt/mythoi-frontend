import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';

const getBattle = async (id: string) => {
    try {
      // Fetch the game by its ID, including related players and playerData
      const battle = await prisma.battle.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!battle) {
        return { message: "Battle not found", status: 404 };
      }
  
      return { message: "Successfully fetched battle", data: { battle }, status: 200 };
    } catch (error: unknown) {
      return nextErrorHandler(error);
    }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = await verifyToken(req);
    if (error) return handleResponse(error);
    const { id } = params;
    const response = await getBattle(id);
    return handleResponse(response);
}