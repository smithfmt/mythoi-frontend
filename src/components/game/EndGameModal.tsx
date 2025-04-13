import { GameData } from "@data/types";
import Link from "next/link";
import { useState } from "react";

type Props = {
    gameData: GameData;
}

const EndGameModal = ({ gameData } : Props) => {
    const { players, winner } = gameData;
    const [closed, setClosed] = useState(false);
    const winningPlayer = players.find(p => p.id === winner);
    if (!winningPlayer) return null;
    return (
        <div className={`${closed ? "hidden": ""} fixed w-full h-full flex justify-center items-center z-[101] bg-black/40`}>
            <div className="relative flex flex-col gap-4 w-96 p-16 border-black border-4 rounded-lg bg-white">
                <h1 className="font-bold text-xl">{winningPlayer.user.name} is the winner!!</h1>
                <Link className="hover:bg-neutral-200 p-4 transition-all rounded-lg" href="/lobbies">Return To Lobbies</Link>
                <button onClick={() => setClosed(true)} className="absolute right-2 top-2 rounded-full hover:bg-neutral-300 hover:text-red-500 transition-all aspect-square w-8 h-8">x</button>
            </div>
        </div>
    );
}

export default EndGameModal;