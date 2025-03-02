import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';
import { GameData } from "@data/types";
import { shuffle } from "@utils/helpers";

export const createBattle = async (gameData: GameData) => {
  try {
    const { players } = gameData;
    if (!players) return { message: "No players found on gameData", status: 404 };
    // Create Battle in DB
    const battle = await prisma.battle.create({
      data: {
        gameId: gameData.id,
        turnOrder: shuffle(players.map(p => p.id)),
      },
    })
    // Create BattleCards for each active card
    const activeCards = await prisma.card.findMany({
      where: {
        gameId: gameData.id,
        inDiscardPile: false,
      },
      select: {
        id : true,
        playerId: true,
        atk: true,
        hp: true,
        x: true,
        y: true,
        inHand: true,
        top: true,
        right: true,
        bottom: true,
        left: true,
      }
    });
    const battleCards = await prisma.battleCard.createManyAndReturn({
      data: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...activeCards.map(({id, ...card}) => ({
          battleId: battle.id,
          currentAtk: card.atk,
          currentHp: card.hp,
          gameCardId: id,
          playerId: card?.playerId || 1,
          inGraveyard: false,
          hasCast: false,
          atk: card.atk,
          hp: card.hp,
          x: card.x ?? 0,  // Default to 0 if null
          y: card.y ?? 0,  // Default to 0 if null
          inHand: card.inHand,
          top: card.top ?? {},  // Default to empty object if null or undefined
          right: card.right ?? {},
          bottom: card.bottom ?? {},
          left: card.left ?? {},
        })),
      ],
    });
    console.log(battleCards)
  } catch (error: unknown) {
    return nextErrorHandler(error);
  }
}

const getBattle = async (id: string) => {
    try {
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