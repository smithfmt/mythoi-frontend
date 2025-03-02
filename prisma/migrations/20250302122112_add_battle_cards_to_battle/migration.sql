/*
  Warnings:

  - You are about to drop the `_BattleToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `battleId` to the `BattleCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BattleToPlayer" DROP CONSTRAINT "_BattleToPlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_BattleToPlayer" DROP CONSTRAINT "_BattleToPlayer_B_fkey";

-- AlterTable
ALTER TABLE "BattleCard" ADD COLUMN     "battleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BattleToPlayer";

-- AddForeignKey
ALTER TABLE "BattleCard" ADD CONSTRAINT "BattleCard_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
