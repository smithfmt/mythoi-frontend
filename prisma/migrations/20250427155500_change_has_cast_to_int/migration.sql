/*
  Warnings:

  - The `hasCast` column on the `BattleCard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BattleCard" ADD COLUMN     "isStunned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTaunted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "hasCast",
ADD COLUMN     "hasCast" INTEGER NOT NULL DEFAULT 0;
