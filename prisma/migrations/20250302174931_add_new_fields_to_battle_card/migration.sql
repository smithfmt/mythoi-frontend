/*
  Warnings:

  - Added the required column `ability` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `BattleCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `BattleCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleCard" ADD COLUMN     "ability" TEXT NOT NULL,
ADD COLUMN     "cost" TEXT[],
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "img" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL;
