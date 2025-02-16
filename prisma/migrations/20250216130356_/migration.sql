/*
  Warnings:

  - You are about to drop the column `baseAtk` on the `BattleCard` table. All the data in the column will be lost.
  - You are about to drop the column `baseHp` on the `BattleCard` table. All the data in the column will be lost.
  - You are about to drop the column `cast` on the `BattleCard` table. All the data in the column will be lost.
  - You are about to drop the column `hand` on the `BattleCard` table. All the data in the column will be lost.
  - You are about to drop the column `host` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `host` on the `Lobby` table. All the data in the column will be lost.
  - You are about to drop the column `gameData` on the `User` table. All the data in the column will be lost.
  - Added the required column `atk` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleCard" DROP COLUMN "baseAtk",
DROP COLUMN "baseHp",
DROP COLUMN "cast",
DROP COLUMN "hand",
ADD COLUMN     "atk" INTEGER NOT NULL,
ADD COLUMN     "hasCast" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hp" INTEGER NOT NULL,
ADD COLUMN     "inHand" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "host",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "host",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gameData";

-- AlterTable
ALTER TABLE "_BattleToPlayer" ADD CONSTRAINT "_BattleToPlayer_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BattleToPlayer_AB_unique";
