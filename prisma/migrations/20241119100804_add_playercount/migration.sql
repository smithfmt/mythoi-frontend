/*
  Warnings:

  - Added the required column `playerCount` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "playerCount" INTEGER NOT NULL;
