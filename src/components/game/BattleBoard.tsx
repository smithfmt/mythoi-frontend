import { PopulatedBattleCardData } from "@data/types";
import Card from "./card";

type Props = {
    board: PopulatedBattleCardData[];
    right?: boolean; 
    setSelectedCard?: (card:PopulatedBattleCardData) => void; 
    selectedCard?: PopulatedBattleCardData;
    setTargetCard?: (card:PopulatedBattleCardData | undefined) => void;
    targetCard?: PopulatedBattleCardData;
    attack?: (card:PopulatedBattleCardData) => void;
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
        if (!card.x || !card.y) return;
        if (card.x>maxX)  maxX=card.x;
        if (card.x<minX) minX=card.x;
    });

    const xOffset = right ? 1 - minX : 9 - maxX;
    
    const handleClick = (card: PopulatedBattleCardData) => {
        if (setSelectedCard) {
            setSelectedCard(card);
        }
        if (setTargetCard && attack && card.hp>0) {
            attack(card);
        }
    }

    const handleMouseOver = (card: PopulatedBattleCardData) => {
        if (selectedCard && setTargetCard) {
            return setTargetCard(card);
        }
    }
    return (
        <div className="flex justify-center items-center ">
            <div className="relative">
                <div className="grid grid-cols-[repeat(11,13rem)] grid-rows-[repeat(11,18rem)] gap-1 border border-gray-300 pointer-events-none"
                    onMouseLeave={() => {if (selectedCard && setTargetCard) setTargetCard(undefined)}}
                >
                {board.map((card, i) => (
                    <div
                        key={`card-${i}`}
                        style={{ gridColumn: (card.x||0) + xOffset + 1, gridRow: card.y }}
                        className={`${setSelectedCard ? "hover:cursor-pointer" : ""} ${setTargetCard && card.hp > 0 ? "hover:cursor-pointer" : ""} pointer-events-auto`}
                        onClick={() => handleClick(card)}
                        onMouseOver={() => handleMouseOver(card)}
                    >
                    <Card card={card} battle={true} />
                    </div>
                ))}
            
                </div>
            </div>
        </div>
    );
}

export default BattleBoard;