import { CardObjectData, PopulatedCardData } from "@data/types";
import Card from "./Card";
import { Dispatch, SetStateAction } from "react";

type Props = {
    selectedCard: PopulatedCardData|null; 
    setSelected: Dispatch<SetStateAction<{selectedCard: PopulatedCardData | null}>>; 
    hand: CardObjectData[];
    handleCardClick: (card:CardObjectData) => void;
}

const Hand = ({selectedCard, setSelected, hand, handleCardClick}:Props) => {

    return (
        <div className="fixed -bottom-24 w-full flex justify-center gap-2 [&>*]:transition-all hover:[&>*]:-translate-y-24 pb-1 z-50 pointer-events-none [&>div]:pointer-events-auto">
            {hand.map((cardData,i) => (
                selectedCard?.uid===cardData.card.uid ? 
                <div key={`card-${i}`} onClick={() => setSelected({ selectedCard: null })} className="relative bg-blue-400 bg-opacity-40 w-[13rem] h-[18rem]"></div>
                : <div key={`card-${i}`} onClick={() => handleCardClick(cardData)}><Card card={cardData.card}/></div>
            ))}
        </div>
    );
};

export default Hand;