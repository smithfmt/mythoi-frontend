import { PopulatedCardData } from "@data/types";
import Card from "./card";
import { Dispatch, SetStateAction } from "react";

type Props = {
    selectedCard: PopulatedCardData|null; 
    setSelected: Dispatch<SetStateAction<{selectedCard: PopulatedCardData | null}>>; 
    hand: PopulatedCardData[];
    handleCardClick: (card:PopulatedCardData) => void;
}

const Hand = ({selectedCard, setSelected, hand, handleCardClick}:Props) => {

    return (
        <div onMouseUp={() => setSelected({ selectedCard: null })} className="fixed -bottom-24 w-full flex justify-center gap-2 [&>*]:transition-all hover:[&>*]:-translate-y-24 pb-1 z-50 pointer-events-none [&>div]:pointer-events-auto">
            {hand.map((card,i) => (
                selectedCard?.uid===card.uid ? 
                <div key={`card-${i}`} onMouseDown={() => setSelected({ selectedCard: null })} className="relative bg-blue-400 bg-opacity-40 w-[13rem] h-[18rem]"></div>
                : <div key={`card-${i}`} onMouseDown={() => handleCardClick(card)}><Card card={card}/></div>
            ))}
        </div>
    );
};

export default Hand;