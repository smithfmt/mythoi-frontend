/*
  Warnings:

  - Added the required column `gameId` to the `BattleCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleCard" ADD COLUMN     "gameId" INTEGER NOT NULL,
ADD COLUMN     "inDiscardPile" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
