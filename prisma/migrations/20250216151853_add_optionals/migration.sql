-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_playerId_fkey";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "playerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
