import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';
import { CardQueryCondition } from "@data/types";

const getCards = async (condition:CardQueryCondition) => {
    try {
      // Fetch the game by its ID, including related players and playerData
      const cards = await prisma.card.findMany({
        where: condition,
      });
  
      if (!cards) {
        return { message: "No Cards found", status: 404 };
      }
  
      return { message: "Successfully fetched cards", data: { cards }, status: 200 };
    } catch (error: unknown) {
      return nextErrorHandler(error);
    }
};

export async function GET(req: NextRequest) {
    const { error } = await verifyToken(req);
    if (error) return handleResponse(error);
    const queryParams = req.nextUrl.searchParams;
    const params:CardQueryCondition = {
        isGeneralSelection: queryParams.get('isGeneralSelection') === 'true' ? true : undefined,
        playerId: queryParams.get('playerId') ? Number(queryParams.get('playerId')) : undefined,
    }
    const response = await getCards(params);
    return handleResponse(response);
}