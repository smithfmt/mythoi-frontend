-- AlterTable
ALTER TABLE "_BattleToPlayer" ADD CONSTRAINT "_BattleToPlayer_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BattleToPlayer_AB_unique";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
