/*
  Warnings:

  - Changed the type of `host` on the `Lobby` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "host",
ADD COLUMN     "host" INTEGER NOT NULL;
