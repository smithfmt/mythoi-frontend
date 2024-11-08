/*
  Warnings:

  - You are about to drop the column `drawnHeroes` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "drawnHeroes",
ADD COLUMN     "discardPile" TEXT[],
ADD COLUMN     "heroDeck" INTEGER[];
