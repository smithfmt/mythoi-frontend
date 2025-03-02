-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_gameId_fkey";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
