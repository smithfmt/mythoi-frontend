import Card from "@components/game/card";
import TitleHud from "@components/ui/TitleHud";
import { cards } from "@data/cards";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card card={cards.general[5]} />
        <TitleHud />
      </main>
    </div>
  );
}
