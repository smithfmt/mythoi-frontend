import { GameData } from "@data/types";
import { useRouter } from "next/router";

type Props = {
    gameData: GameData;
}

const EndGameModal = ({ gameData } : Props) => {
    const router = useRouter();
    const { players, winner } = gameData;
    const winningPlayer = players.find(p => p.id === winner);
    if (!winningPlayer) return null;
    return (
        <div className="fixed w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-4 w-96 p-16 border-black border-4 rounded-lg bg-white">
                <h1 className="font-bold text-xl">{winningPlayer.user.name} is the winner!!</h1>
                <button onClick={() => router.push("/lobbies")}>Return To Lobbies</button>
            </div>
        </div>
    );
}

export default EndGameModal;