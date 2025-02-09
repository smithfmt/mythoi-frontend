import { BoardType, CardObjectData } from "@data/types";
import Card from "./card";

type Props = {
    board: BoardType;
    right?: boolean; 
    setSelectedCard?: (card:CardObjectData) => void; 
    selectedCard?: CardObjectData;
    setTargetCard?: (card:CardObjectData | undefined) => void;
}

const BattleBoard = ({ board, right=false, setSelectedCard, selectedCard, setTargetCard } : Props ) => {
    let [minX,maxX] = [6,6];
    board.forEach(card => {
        if (card.x>maxX)  maxX=card.x;
        if (card.x<minX) minX=card.x;
    });

    const xOffset = right ? 1 - minX : 9 - maxX;
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="relative">
                <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300 pointer-events-none"
                    onMouseLeave={() => {if (selectedCard && setTargetCard) setTargetCard(undefined)}}
                >
                {board.map((item, i) => (
                    <div
                        key={`card-${i}`}
                        style={{ gridColumn: item.x + xOffset + 1, gridRow: item.y + 1 }}
                        onClick={() => (setSelectedCard && setSelectedCard(item))}
                        className={`${setSelectedCard ? "hover:cursor-pointer" : ""} pointer-events-auto`}
                        onMouseOver={() => {if (selectedCard && setTargetCard) return (console.log(item),setTargetCard(item))}}
                    >
                    <Card card={item.card} />
                    </div>
                ))}
            
                </div>
            </div>
        </div>
    );
}

export default BattleBoard;