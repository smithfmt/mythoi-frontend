/*
  Warnings:

  - The primary key for the `_BattleToPlayer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_BattleToPlayer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_BattleToPlayer" DROP CONSTRAINT "_BattleToPlayer_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_BattleToPlayer_AB_unique" ON "_BattleToPlayer"("A", "B");
