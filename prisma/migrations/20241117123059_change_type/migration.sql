/*
  Warnings:

  - The `turnOrder` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "turnOrder",
ADD COLUMN     "turnOrder" INTEGER[];
