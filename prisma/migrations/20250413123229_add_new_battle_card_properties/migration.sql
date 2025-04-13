-- AlterTable
ALTER TABLE "BattleCard" ADD COLUMN     "buffs" TEXT[],
ADD COLUMN     "hasAttacked" BOOLEAN NOT NULL DEFAULT false;
