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
                }
            }
        }
    });
    return gameData;
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
    });
    return playerData;
}