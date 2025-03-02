import { GameData, PopulatedCardData } from '@data/types';
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