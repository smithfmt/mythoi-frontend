/*
  Warnings:

  - The `heroDeck` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "heroShop" JSONB,
DROP COLUMN "heroDeck",
ADD COLUMN     "heroDeck" INTEGER[];
