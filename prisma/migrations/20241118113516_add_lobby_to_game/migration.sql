-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "gameId" INTEGER;

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
