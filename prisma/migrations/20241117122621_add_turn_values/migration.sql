/*
  Warnings:

  - The `discardPile` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `heroShop` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "turnOrder" TEXT[],
ALTER COLUMN "turn" SET DEFAULT 1,
DROP COLUMN "discardPile",
ADD COLUMN     "discardPile" JSONB,
ALTER COLUMN "heroShop" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "turnEnded" BOOLEAN NOT NULL DEFAULT false;
