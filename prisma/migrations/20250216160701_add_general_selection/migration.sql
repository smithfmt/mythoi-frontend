-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "isGeneralSelection" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "generalSelected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "turnEnded" BOOLEAN NOT NULL DEFAULT false;
