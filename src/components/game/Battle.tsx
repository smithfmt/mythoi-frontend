import { BattleData, BoardType, CardObjectData, GameData, PlayerData } from "@data/types";
import Card from "./Card";
import { addActiveConnections } from "@lib/game/gameLogic";

type Props = {
    gameData: GameData;
}

const BattleBoard = ({ board }: {board: BoardType}) => {
    return (
        <div className="flex justify-center items-center max-h-[100vh] max-w-[50vw] hover:cursor-grab active:cursor-grabbing select-none">
            <div className="relative">
                <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300">
                {board.map((item, i) => (
                    <div
                    key={`card-${i}`}
                    style={{ gridColumn: item.x + 1, gridRow: item.y + 1 }}
                    >
                    <Card card={item.card} />
                    </div>
                ))}
            
                </div>
            </div>
        </div>
    );
}

const findCardsInBoard = (playerData: PlayerData) => {
    const cardsWithConnections = playerData?.cards ? addActiveConnections(playerData.cards as BoardType) : [];
    const inBoard: CardObjectData[] = [];
    const inHand: CardObjectData[] = [];
    cardsWithConnections.forEach(cardData => cardData.hand ? inHand.push(cardData) : inBoard.push(cardData));
    return { cardsInBoard:inBoard, cardsInHand: inHand };
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
    const currentBattlePlayerIds = currentBattle.players.map(p => p.id);
    const players = gameData.players.map(p => {
        const playerData = JSON.parse(p.gameData as string) as PlayerData
        const { cardsInBoard, cardsInHand } = findCardsInBoard(playerData) 
        return {...p, gameData: playerData, cardsInBoard, cardsInHand };
    });
    

    return (
        <div className="w-full h-full flex gap-16">
            <BattleBoard board={players.filter(p => p.id === currentBattlePlayerIds[0])[0].cardsInBoard as BoardType}/>
            <BattleBoard board={players.filter(p => p.id === currentBattlePlayerIds[1])[0].cardsInBoard as BoardType}/>
            {/* Modal */}
            <div className="hidden fixed w-full h-full top-0 left-0 bg-black/50  items-center justify-center z-50">
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
        </div>
        
    )
};

export default Battle;