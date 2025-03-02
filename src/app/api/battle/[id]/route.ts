import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';
import { GameData, PopulatedBattleCardData } from "@data/types";
import { shuffle } from "@utils/helpers";
import { UserType } from "@app/api/types";
import { findBattleById, findBattleCardById, findPlayerById, findUserById } from "@app/api/requests";
import { calcConnectedStats } from "@lib/game/cardUtils";

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
        inHeroShop: false,
      },
    });
    await prisma.battleCard.createMany({
      data: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...activeCards.filter(c => c.playerId).map(({id, inHeroShop, ...card}) => ({
          ...card,
          battleId: battle.id,
          currentAtk: card.atk,
          currentHp: card.hp,
          gameCardId: id,
          playerId: card.playerId ?? 1,
          inGraveyard: false,
          hasCast: false,
          top: card.top ?? {},
          right: card.right ?? {},
          bottom: card.bottom ?? {},
          left: card.left ?? {},
        })),
      ],
    });
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

interface UpdateData {
  selectedCardId: number;
  targetCardId: number;
  abilityId: string;
}

const updateBattle = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const battleData = await findBattleById(parseInt(id));
    if (!battleData) return { message: "Game not found", status: 404 };
    const { game } = battleData;
    if (game.currentBattleId !== battleData.id) return { message: "This is not the current battle", status: 401 };
    if (!game.battling) return { message: "Game is not currently in a battle", status: 401 };
    const userData = await findUserById(user.id);
    if (!userData) return { message: "User Data not found", status: 404 };
    const playerData = await findPlayerById(userData.player?.id);
    if (!playerData) return { message: "Player Data not found", status: 404 };
    const oponentId = game.players.find(player => player.id !==playerData.id)?.id;
    if (!oponentId) return { message: "Oponent id not found", status: 404 };
    const oponentData = await findPlayerById(oponentId);
    if (!oponentData) return { message: "Oponent Data not found", status: 404 };
    const isYourTurn = playerData.id===battleData.turnOrder[0];
    if (!isYourTurn) return { message: "It is not your turn", status: 401 };

    switch (action) {
      case "battle-attack":
        const { selectedCardId, targetCardId } = data;
        // Verify the required data is provided
        if (!selectedCardId || !targetCardId) return { message: "Invalid Data", status: 401 };
        // Validate that selected card can attack
        const selectedCardData = await findBattleCardById(selectedCardId)  as unknown as PopulatedBattleCardData;
        if (!selectedCardData) return { message: "Selected Card not found", status: 401 };
        if (selectedCardData.currentAtk < 1 || selectedCardData.inHand) return { message: "Selected Card cannot attack", status: 401 };
        // Validate that the target card can be attacked
        const targetCardData = await findBattleCardById(targetCardId) as unknown as PopulatedBattleCardData;
        if (!targetCardData || targetCardData.currentHp < 1) return { message: "Target Card cannot be attacked", status: 401 };
        // Calculate Connection Bonuses 
        const { newAtk: selectedNewAtk } = calcConnectedStats(selectedCardData);
        const { newHp: targetNewHp } = calcConnectedStats(targetCardData);
        // Update Cards for both Players
        await prisma.battleCard.update({
          where: { id: selectedCardId },
          data: {
            currentHp: selectedCardData.currentHp - targetCardData.currentAtk,
          },
        })
        await prisma.battleCard.update({
          where: { id: targetCardId },
          data: {
            currentHp:(targetNewHp || targetCardData.currentHp) - (selectedNewAtk || selectedCardData.currentAtk),
          },
        });
        // UPDATE CONNECTIONS on remaining cards -- do a check if any cards were removed, then run a function to cleanup board & reapply connections
        
        // Update battle data with both players
        // const { playerData: finalCurrentPlayerData, graveyard } = sendDeadToGraveyard(currentPlayerData, currentBattle.graveyard);
        // const { playerData: finalOponentData, graveyard: finalGraveyard } = sendDeadToGraveyard(currentPlayerData, graveyard);
        break;
      case "battle-cast":
        break;
      default:
        return { message: "Invalid action", status: 400 };
    }
    return { message: "Successfully updated game", status: 201 };
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) return handleResponse(error);
  const { action, data } = await req.json();
  const { id } = params;
  const response = await updateBattle(user, id, action, data);
  return handleResponse(response);
}