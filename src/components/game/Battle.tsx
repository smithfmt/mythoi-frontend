import { BattleData, BoardType, CardObjectData, GameData, PlayerData } from "@data/types";
import { addActiveConnections } from "@lib/game/gameLogic";
import { useEffect, useRef, useState } from "react";
import BattleHud from "./BattleHud";
import BattleBoard from "./BattleBoard";

type Props = {
    gameData: GameData;
    scale: number;
    setScale: (x:number) => void;
}


const findCardsInBoard = (playerData: PlayerData) => {
    const cardsWithConnections = playerData?.cards ? addActiveConnections(playerData.cards as BoardType) : [];
    const inBoard: CardObjectData[] = [];
    const inHand: CardObjectData[] = [];
    cardsWithConnections.forEach(cardData => cardData.hand ? inHand.push(cardData) : inBoard.push(cardData));
    return { cardsInBoard:inBoard, cardsInHand: inHand };
}

const Battle = ({ gameData, scale, setScale } : Props) => {
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const boardRef = useRef<HTMLDivElement | null>(null);

    const [selectedCard, setSelectedCard] = useState<CardObjectData | undefined>(undefined);
    const [targetCard, setTargetCard] = useState<CardObjectData | undefined>(undefined);


    const easingDuration = 0.2; 

    useEffect(() => {
        setScale(0.75);
    },[setScale]);

    useEffect(() => {
        const handleCtrlPress = (e: KeyboardEvent, value:boolean) => {
            if (e.key==="Control") {
                setCtrlPressed(value);
            }
        }
        window.addEventListener("keydown", (e) => handleCtrlPress(e,true));
        window.addEventListener("keyup", (e) => handleCtrlPress(e,false));
        return () => {
            window.removeEventListener("keydown", (e) => handleCtrlPress(e,true));
            window.removeEventListener("keyup", (e) => handleCtrlPress(e,false));
        }
    }, [setCtrlPressed]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            setOffset((prevOffset) => ({
            x: prevOffset.x + dx/2,
            y: prevOffset.y + dy/2,
            }));
            setStartPos({ x: e.clientX, y: e.clientY });
        };

        

        if (ctrlPressed) {
            if (dragging) {
                window.addEventListener("mousemove", handleMouseMove);
            } else {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            }
        }
        
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, startPos, ctrlPressed]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const moveAmount = 50; 
            switch (e.key) {
                case "ArrowUp":
                setOffset((prev) => ({ ...prev, y: prev.y + moveAmount }));
                break;
                case "ArrowDown":
                setOffset((prev) => ({ ...prev, y: prev.y - moveAmount }));
                break;
                case "ArrowLeft":
                setOffset((prev) => ({ ...prev, x: prev.x + moveAmount }));
                break;
                case "ArrowRight":
                setOffset((prev) => ({ ...prev, x: prev.x - moveAmount }));
                break;
                default:
                break;
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

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
    
    const whoTurn = currentBattle.players.filter(p => p.id === currentBattle.turnOrder[0])[0].id;

    return (
        <div className="w-full h-full flex justify-center gap-16">
            <BattleHud 
                battleData={currentBattle} 
                whoTurn={whoTurn} 
                selectedCard={selectedCard}
                targetCard={targetCard}
            />
            <div className="max-w-screen max-h-screen flex justify-center items-center">
                <div
                    ref={boardRef}
                    className={`relative h-full flex justify-center select-none ${ctrlPressed ? dragging ? "cursor-grabbing" : "cursor-grab" : ""}`}
                    style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transition: dragging ? 'none' : `transform ${easingDuration}s ease`, 
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <BattleBoard setSelectedCard={setSelectedCard} board={players.filter(p => p.id === currentBattlePlayerIds[0])[0].cardsInBoard as BoardType} />
                    <span className="w-4 h-full bg-black">a</span>
                    <BattleBoard setTargetCard={setTargetCard} selectedCard={selectedCard} right={true} board={players.filter(p => p.id === currentBattlePlayerIds[1])[0].cardsInBoard as BoardType}/>
                </div>
                
            </div>
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