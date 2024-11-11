// import prisma from "@prisma/prismaClient";

// export const updateUserList = async () => {
//     const io = getSocket();
//     const users = await prisma.user.findMany();
//     const userNames = users.map((user) => user.name);
//     io.emit("userListUpdate", userNames);
// };

// export const updateLobbyList = async () => {
//     const io = getSocket();
//     const lobbyData = await prisma.lobby.findMany({
//         include: {
//             players: {
//                 select: {
//                     id: true,
//                     name: true,
//                 }
//             }
//         }
//     });
//     const lobbies = lobbyData.map(lobby => !lobby.started ? lobby : "");
//     io.emit("lobbyListUpdate", lobbies);
// };

// export const updateLobbyData = async (lobbyId: number, gameId?:number) => {
//     const io = getSocket();
//     const lobbyData = await prisma.lobby.findUnique({
//         where: {
//             id: lobbyId,
//         }, 
//         include: {
//             players: {
//                 select: {
//                     id: true,
//                     name: true,
//                 }
//             }
//         }
//     });
//     io.emit(`lobbyDataUpdate-${lobbyId}`, {...lobbyData, gameId});
// }

// export const updateGameList = async () => {
//     const io = getSocket();
//     const games = await prisma.game.findMany();
//     io.emit("gameListUpdate", games);
// };

// export const updateGameData = async (gameId:number) => {
//     const io = getSocket();
//     const gameData = await prisma.game.findUnique({
//         where: {
//             id: gameId
//         },
//         include: {
//             players: {
//                 select: {
//                     id: true,
//                     name: true,
//                 }
//             }
//         }
//     });
//     io.emit(`gameDataUpdate-${gameId}`, gameData);
// };

