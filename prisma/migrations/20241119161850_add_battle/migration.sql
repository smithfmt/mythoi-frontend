-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "battleOrder" INTEGER[],
ADD COLUMN     "battles" JSONB,
ADD COLUMN     "battling" BOOLEAN NOT NULL DEFAULT false;
