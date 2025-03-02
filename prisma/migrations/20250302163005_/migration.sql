/*
  Warnings:

  - You are about to drop the column `battleOrder` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BattleCard" DROP CONSTRAINT "BattleCard_battleId_fkey";

-- DropForeignKey
ALTER TABLE "BattleCard" DROP CONSTRAINT "BattleCard_playerId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "battleOrder",
ADD COLUMN     "currentBattleId" INTEGER;

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
