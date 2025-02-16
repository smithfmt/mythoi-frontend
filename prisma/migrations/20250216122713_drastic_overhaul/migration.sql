/*
  Warnings:

  - You are about to drop the column `battles` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `discardPile` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `heroShop` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Lobby` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lobbyId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lobbyId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lobby" DROP CONSTRAINT "Lobby_gameId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "battles",
DROP COLUMN "discardPile",
DROP COLUMN "heroShop",
ADD COLUMN     "lobbyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gameId";

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "inDiscardPile" BOOLEAN NOT NULL DEFAULT false,
    "inHeroShop" BOOLEAN NOT NULL DEFAULT false,
    "uid" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "atk" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "top" JSONB NOT NULL,
    "right" JSONB NOT NULL,
    "bottom" JSONB NOT NULL,
    "left" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "ability" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "cost" TEXT[],
    "desc" TEXT NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "inHand" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "ended" BOOLEAN NOT NULL,
    "turnOrder" INTEGER[],
    "turn" INTEGER NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleCard" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "gameCardId" INTEGER,
    "inGraveyard" BOOLEAN NOT NULL DEFAULT false,
    "currentAtk" INTEGER NOT NULL,
    "currentHp" INTEGER NOT NULL,
    "baseAtk" INTEGER NOT NULL,
    "baseHp" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "hand" BOOLEAN DEFAULT false,
    "top" JSONB NOT NULL,
    "right" JSONB NOT NULL,
    "bottom" JSONB NOT NULL,
    "left" JSONB NOT NULL,
    "cast" BOOLEAN DEFAULT false,

    CONSTRAINT "BattleCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BattleToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_key" ON "Player"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_playerId_key" ON "Card"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_gameId_key" ON "Card"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "_BattleToPlayer_AB_unique" ON "_BattleToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_BattleToPlayer_B_index" ON "_BattleToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Game_lobbyId_key" ON "Game"("lobbyId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_gameCardId_fkey" FOREIGN KEY ("gameCardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BattleToPlayer" ADD CONSTRAINT "_BattleToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Battle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BattleToPlayer" ADD CONSTRAINT "_BattleToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
