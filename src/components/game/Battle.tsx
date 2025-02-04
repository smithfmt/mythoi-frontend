import { BattleData, GameData } from "@data/types";

type Props = {
    gameData: GameData;
}

const Battle = ({ gameData } : Props) => {
    const {
        battles,
        battleOrder,
        turn,
    } = gameData;
    let battleIndex = 0;
    battleOrder.forEach((b,i) => { if (b===turn) battleIndex=i });
    const currentBattle = JSON.parse(battles[battleIndex] as string) as BattleData;

    return (
        <div className="fixed w-full h-full top-0 left-0 bg-black/50 flex items-center justify-center z-50">
            <div className="p-16 bg-white text-black text-2xl font-bold text-center">
                <h1>BATTLE</h1>
                {currentBattle ? <div>
                    <h2>Players:</h2>
                    {currentBattle.players.map((p, i) => <p key={`player${i}`}>{p.name}</p>)}
                    <br />
                    <h2>Turn</h2>
                    <p>{currentBattle.turn}</p>
                    <h2>Who First?</h2>
                    <p>{currentBattle.players.filter(p => p.id === currentBattle.turnOrder[0])[0].name}</p>
                </div> : <p className="text-red-500">Current Battle not found</p>}
            </div>
        </div>
    )
};

export default Battle;