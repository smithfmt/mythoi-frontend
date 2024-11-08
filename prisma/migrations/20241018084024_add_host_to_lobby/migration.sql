/*
  Warnings:

  - Added the required column `host` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "host" TEXT NOT NULL;
