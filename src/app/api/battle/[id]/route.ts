import { verifyToken } from "@lib/auth/verifyToken";
import { handleResponse } from "@utils/handleResponse";
import { nextErrorHandler } from "@utils/nextErrorHandler";
import { NextRequest } from "next/server";
import prisma from '@prisma/prismaClient';
import { BattleData, GameData, PlayerData, PopulatedBattleCardData } from "@data/types";
import { rotateArray, shuffle } from "@utils/helpers";
import { UserType } from "@app/api/types";
import { findBattleById, findBattleCardById, findPlayerById, findUserById, updateBattleCard } from "@app/api/requests";
import { calcConnectedStats } from "@lib/game/cardUtils";
import { updateConnectionsForPlayers } from "@lib/game/gameplay";
import { abilities } from "@data/abilities";

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
    await prisma.game.update({
      where: { id: gameData.id },
      data: {
        currentBattleId: battle.id,
      },
    });
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
        ...activeCards.filter(c => c.playerId).map(({id, inHeroShop, isGeneralSelection, ...card}) => ({
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
        include: {
          game: {
            select: {
              players: {
                include: {
                  battleCards: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
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

const manageTurns = async (id: number) => {
  try {
    const battleData = await findBattleById(id);
    if (!battleData) return console.error("No battle found");
    const { players } = battleData.game;
    const allPlayersEndedTurn = players.reduce((acc, cur) => acc&&cur.turnEnded,true);
    if (!allPlayersEndedTurn) return;
    // Update all players to turnEnded = false;
    await prisma.player.updateMany({
      where: { 
        id: {
          in: players.map(p => p.id),
        },
      },
      data: {
        turnEnded: false,
      },
    });

    // Update Battle turn value
    await prisma.battle.update({
      where: { id },
      data: {
        turn: battleData.turn+1,
      },
    });

  } catch(e) {
    console.warn("Error managing turns:", e);
  }
}

const endBattle = async (battleData: BattleData, playerData: PlayerData, oponentData: PlayerData, winner: number) => {
  const { game } = battleData;
  if (!game) return { message: "No game sent to end battle", status: 404 };

  const gameWinner = game.turn+1 > game.battleOrder[game.battleOrder.length-1] ? winner : undefined; // TODO: CHANGE TO ACTUALLY CHECK THE WINNER BASED ON PAST BATTLES

  await Promise.all([
    prisma.player.update({
      where: { id: playerData.id },
      data: {
        battleWins: winner === -1 || winner === playerData.id ? playerData.battleWins + 1 : playerData.battleWins,
        turnEnded: false,
      }
    }),
    prisma.player.update({
      where: { id: oponentData.id },
      data: {
        battleWins: winner === -1 || winner === oponentData.id ? oponentData.battleWins + 1 : oponentData.battleWins,
        turnEnded: false,
      }
    }),  
    prisma.battle.update({
      where: { id: battleData.id },
      data: {
        ended: true,
      }
    }),
    prisma.game.update({
      where: { id: game.id },
      data: {
        battling: false,
        turn: game.turn++,
        winner: gameWinner,
      }
    })
  ]);

  return { message: "Successfully ended battle " + battleData.id, status: 200 };
}

const updateBattle = async (user: UserType, id: string, action: string, data:UpdateData) => {
  try {
    // Fetch the current game, including playerData
    const battleData = await findBattleById(parseInt(id)) as BattleData;
    if (!battleData) return { message: "Battle not found", status: 404 };
    const { game } = battleData;
    if (!game) return { message: "Game not found", status: 404 };
    if (game.currentBattleId !== battleData.id) return { message: "This is not the current battle", status: 401 };
    if (!game.battling) return { message: "Game is not currently in a battle", status: 401 };
    const userData = await findUserById(user.id);
    if (!userData) return { message: "User Data not found", status: 404 };
    const playerData = await findPlayerById(userData.player?.id) as PlayerData;
    if (!playerData) return { message: "Player Data not found", status: 404 };
    const oponentId = game.players.find(player => player.id !==playerData.id)?.id;
    if (!oponentId) return { message: "Oponent id not found", status: 404 };
    const oponentData = await findPlayerById(oponentId) as PlayerData;
    if (!oponentData) return { message: "Oponent Data not found", status: 404 };
    const isYourTurn = playerData.id===battleData.turnOrder[0];
    if (!isYourTurn || playerData.turnEnded === true) return { message: "It is not your turn", status: 401 };
    const { selectedCardId, targetCardId } = data;
    let selectedCardData: PopulatedBattleCardData;
    let targetCardData: PopulatedBattleCardData;
    switch (action) {
      case "attack":
        // Verify the required data is provided
        if (!selectedCardId || !targetCardId) return { message: "Invalid Data", status: 401 };
        // Validate that selected card can attack
        selectedCardData = await findBattleCardById(selectedCardId)  as unknown as PopulatedBattleCardData;
        if (!selectedCardData) return { message: "Selected Card not found", status: 401 };
        if (selectedCardData.currentAtk < 1 || selectedCardData.inHand) return { message: "Selected Card cannot attack", status: 401 };
        // Validate that the target card can be attacked
        targetCardData = await findBattleCardById(targetCardId) as unknown as PopulatedBattleCardData;
        if (!targetCardData || targetCardData.currentHp < 1) return { message: "Target Card cannot be attacked", status: 401 };
        // Calculate Connection Bonuses 
        const { newAtk: selectedNewAtk } = calcConnectedStats(selectedCardData);
        const { newHp: targetNewHp } = calcConnectedStats(targetCardData);
        // Update Cards for both Players
        const newSelectedHp = selectedCardData.currentHp - targetCardData.currentAtk;
        await prisma.battleCard.update({
          where: { id: selectedCardId },
          data: {
            currentHp: newSelectedHp,
            inGraveyard: newSelectedHp<=0,
          },
        });
        const newTargetHp = (targetNewHp || targetCardData.currentHp) - (selectedNewAtk || selectedCardData.currentAtk)
        await prisma.battleCard.update({
          where: { id: targetCardId },
          data: {
            currentHp: newTargetHp,
            inGraveyard: newTargetHp<=0,
          },
        });

        const winner = await updateConnectionsForPlayers(playerData.id, oponentData.id, battleData.id);

        if (!!winner) return endBattle(battleData, playerData, oponentData, winner);

        // End turn for player
        await prisma.player.update({
          where: { id: playerData.id },
          data: {
            turnEnded: true,
          },
        });
        // Rotate Turn order in battle
        await prisma.battle.update({
          where: { id: battleData.id },
          data: {
            turnOrder: rotateArray(battleData.turnOrder),
          },
        });
        break;
      case "cast":
        // Verify the required data is provided
        if (!selectedCardId) return { message: "Invalid Data", status: 401 };
        // Validate that selected card can attack
        selectedCardData = await findBattleCardById(selectedCardId)  as unknown as PopulatedBattleCardData;
        if (!selectedCardData) return { message: "Selected Card not found", status: 404 };
        if (selectedCardData.hasCast) return { message: "Selected card has already cast", status: 401 };
        const ability = abilities[selectedCardData.ability];
        if (ability.condition && !ability.condition(selectedCardData)) return { message: "Cast condition not met", status: 401 };
        // Validate that the target card can be attacked
        targetCardData = await findBattleCardById(targetCardId) as unknown as PopulatedBattleCardData;
        if (targetCardId && !targetCardData) return { message: "Target Card Data not found", status: 404 };
        switch (ability.type) {
          case "basicPowerupEffect":
            const { effectedCasterCard } = ability.effect(selectedCardData);
            await updateBattleCard(effectedCasterCard);
            break;
          case "basicTargetableEffect":
            break;
          case "choiceTargetableEffect":
            break;
          default:
            return { message: "Invalid Ability Type", status: 401 };
        }
        break;
      default:
        return { message: "Invalid action", status: 400 };
    }
    await manageTurns(battleData.id);
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