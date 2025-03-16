import { ActionType, BattleData, PopulatedBattleCardData } from "@data/types";
import { useEffect, useRef, useState } from "react";
import BattleHud from "./BattleHud";
import BattleBoard from "./BattleBoard";
import { useLoading } from "@components/providers/LoadingContext";
import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { updateBattleById } from "@app/requests";

type Props = {
    battleData: BattleData;
    scale: number;
    setScale: (x:number) => void;
    userId: number | null;
}

const Battle = ({ battleData, scale, setScale, userId } : Props) => {
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [shiftPressed, setShiftPressed] = useState(false);
    const boardRef = useRef<HTMLDivElement | null>(null);

    const [selectedCard, setSelectedCard] = useState<PopulatedBattleCardData | undefined>(undefined);
    const [targetCard, setTargetCard] = useState<PopulatedBattleCardData | undefined>(undefined);

    const [action, setAction] = useState<ActionType>("attack");


    const easingDuration = 0.2; 

    useEffect(() => {
        setScale(0.75);
    },[setScale]);

    useEffect(() => {
        const handleShiftPress = (e: KeyboardEvent, value:boolean) => {
            if (e.key==="Shift") {
                setShiftPressed(value);
            }
        }
        window.addEventListener("keydown", (e) => handleShiftPress(e,true));
        window.addEventListener("keyup", (e) => handleShiftPress(e,false));
        return () => {
            window.removeEventListener("keydown", (e) => handleShiftPress(e,true));
            window.removeEventListener("keyup", (e) => handleShiftPress(e,false));
        }
    }, [setShiftPressed]);

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

        

        if (shiftPressed) {
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
    }, [dragging, startPos, shiftPressed]);

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

    useEffect(() => {
        setAction("attack");
    }, [selectedCard])

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const attack = async (targetCard:PopulatedBattleCardData) => {
        if (!selectedCard) return;
        try {
            startLoading();
            await updateBattleById(battleData.id, "attack", {
                selectedCardId: selectedCard.id,
                targetCardId: targetCard.id,
            });
            setSelectedCard(undefined);
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    }
    
    const players = battleData.game?.players;
    if (!players) return null;
    const whoTurn = battleData.turnOrder[0];

    const thisPlayerCards = players.find(p => p.userId===userId);
    const oponentPlayerCards = players.filter(p => p.userId!==userId)[0];
    if (!thisPlayerCards || !oponentPlayerCards) return null;

    const thisPlayerCardsInPlay = thisPlayerCards.battleCards.filter(card => !card.inHand&&!card.inGraveyard&&card.x&&card.y);
    const oponentPlayerCardsInPlay = oponentPlayerCards.battleCards.filter(card => !card.inHand&&!card.inGraveyard&&card.x&&card.y);

    return (
        <div className="w-full h-full flex justify-center gap-16">
            <BattleHud 
                battleData={battleData} 
                players={players}
                whoTurn={whoTurn} 
                selectedCard={selectedCard}
                targetCard={targetCard}
                userId={userId}
                action={action}
                setAction={setAction}
            />
            <div className="max-w-screen max-h-screen flex justify-center items-center">
                <div
                    ref={boardRef}
                    className={`relative h-full flex justify-center select-none ${shiftPressed ? dragging ? "cursor-grabbing" : "cursor-grab" : ""}`}
                    style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transition: dragging ? 'none' : `transform ${easingDuration}s ease`, 
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <BattleBoard setSelectedCard={setSelectedCard} board={thisPlayerCardsInPlay} />
                    <span className="w-4 h-full bg-black">a</span>
                    <BattleBoard attack={attack} setTargetCard={setTargetCard} selectedCard={selectedCard} right={true} board={oponentPlayerCardsInPlay}/>
                </div>
                
            </div>
        </div>
        
    )
};

export default Battle;