import { BoardType, CardObjectData } from "@data/types";
import Card from "./card";

type Props = {
    board: BoardType;
    right?: boolean; 
    setSelectedCard?: (card:CardObjectData) => void; 
    selectedCard?: CardObjectData;
    setTargetCard?: (card:CardObjectData | undefined) => void;
    targetCard?: CardObjectData;
    attack?: (card:CardObjectData) => void;
}

const BattleBoard = ({ 
    board, 
    right=false, 
    setSelectedCard, 
    selectedCard, 
    setTargetCard, 
    // targetCard,
    attack,
} : Props ) => {
    let [minX,maxX] = [6,6];
    board.forEach(card => {
        if (card.x>maxX)  maxX=card.x;
        if (card.x<minX) minX=card.x;
    });

    const xOffset = right ? 1 - minX : 9 - maxX;
    
    const handleClick = (card: CardObjectData) => {
        if (setSelectedCard) {
            setSelectedCard(card);
        }
        if (setTargetCard && attack && card.card.hp>0) {
            attack(card);
        }
    }

    const handleMouseOver = (card: CardObjectData) => {
        if (selectedCard && setTargetCard) {
            return setTargetCard(card);
        }
    }

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
                        className={`${setSelectedCard ? "hover:cursor-pointer" : ""} ${setTargetCard && item.card.hp > 0 ? "hover:cursor-pointer" : ""} pointer-events-auto`}
                        onClick={() => handleClick(item)}
                        onMouseOver={() => handleMouseOver(item)}
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