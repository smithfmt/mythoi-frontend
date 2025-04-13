import { Attribute, Connection, GameData, PopulatedBattleCardData, PopulatedCardData } from '@data/types';
import { Prisma } from '@prisma/client';
import prisma from '@prisma/prismaClient';

export const findUserById = async (id: number) => {
    const userData = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          player: true,
        }
    });
    return userData;
};

export const updateUserById = async (id: number, data) => {
    const userData = await prisma.user.update({
        where: { id },
        data,
    });
    return userData;
}

export const findGameById = async (id: number) => {
    const gameData = await prisma.game.findUnique({
        where: { id },
        include: {
            players: {
                select: {
                    id: true,
                    turnEnded: true,
                }
            },
            battles: {
                select: {
                    id: true,
                },
            },
        },
    });
    return gameData as GameData;
}

export const updateGameById = async (id: number, data) => {
    const gameData = await prisma.game.update({
        where: { id },
        data,
    });
    return gameData;
}

export const findPlayerById = async (id?: number) => {
    if (!id) return null;
    const playerData = await prisma.player.findUnique({
        where: { id },
        include: {
            cards: true,
        },
    });
    return playerData;
}

export const findCardById = async (id?: number) => {
    if (!id) return null;
    const cardData = await prisma.card.findUnique({
        where: { id },
    });
    return cardData;
}

export const updateCardById = async (id: number, data) => {
    const cardData = await prisma.card.update({
        where: { id },
        data,
    });
    return cardData;
}

export const findHeroShopCards = async (includeDiscarded=false) => {
    const heroShopCards = await prisma.card.findMany({
        where: {
            inHeroShop: true,
            inDiscardPile: includeDiscarded,
        },
    });
    return heroShopCards;
}

export const updateCards = async (cards: PopulatedCardData[]) => {
    await Promise.all(cards.map(async ({ id, top, right, bottom, left, x, y, inHand }) => {
        await prisma.card.update({
          where: { id },
          data: {
            top, right, bottom, left, x, y, inHand,
          }
        })
    }))
}

export const findBattleById = async (id?:number) => {
    if (!id) return null;
    const battleData = await prisma.battle.findUnique({
        where: { id },
        include: {
            game: {
                include: {
                    players: true,
                },
            },
        },
    });
    return battleData;
}

export const findBattleCardById = async (id?:number) => {
    if (!id) return null;
    const battleCardData = await prisma.battleCard.findUnique({
        where: { id },
    });
    return battleCardData;
}

export const findBattleCardsByParams = async (
    params: Prisma.BattleCardWhereInput
): Promise<PopulatedBattleCardData[]> => {
    const battleCards = await prisma.battleCard.findMany({ where: params });
    return battleCards.map(card => ({
        ...card,
        top: card.top as Connection,
        right: card.right as Connection,
        bottom: card.bottom as Connection,
        left: card.left as Connection,
        cost: card.cost as Attribute[],
        gameCardId: card.gameCardId ?? undefined,
        x: card.x ?? undefined,
        y: card.y ?? undefined,
    }));
};

export const updateBattleCard = async (battleCard:PopulatedBattleCardData) => {
    const { id, player, gameCard, ...updateData } = battleCard;
    
    const dataToUpdate: Prisma.BattleCardUpdateInput = {
        ...updateData,
    };

    await prisma.battleCard.update({
        where: { id },
        data: dataToUpdate,
    });
}

export const updateManyBattleCards = async (battleCards: PopulatedBattleCardData[]) => {
    await prisma.$transaction(
        battleCards.map(card => {
            const { id, player, gameCard, ...updateData } = card;

            const dataToUpdate: Prisma.BattleCardUpdateInput = {
                ...updateData,
            };

            return prisma.battleCard.update({
                where: { id },
                data: dataToUpdate,
            });
        }),
    );
}