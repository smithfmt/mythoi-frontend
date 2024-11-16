import prisma from '@prisma/prismaClient';

export const findUserById = async (id: number) => {
    const userData = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          gameData: true,
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
        where: { id }
    });
    return gameData;
}

export const updateGameById = async (id: number, data) => {
    console.log("UPDATING", id, data)
    const gameData = await prisma.game.update({
        where: { id },
        data,
    });
    return gameData;
}