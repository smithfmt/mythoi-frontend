import { CardObjectData } from "@data/types";
import Card from "./Card";

const Hand = ({hand, handleCardClick}:{hand: CardObjectData[], handleCardClick: (card:CardObjectData) => void}) => {

    return (
        <div className="fixed -bottom-24 w-full flex justify-center gap-2 [&>*]:transition-all hover:[&>*]:-translate-y-24 pb-1">
            {hand.map((cardData,i) => <div key={`card-${i}`} onClick={() => handleCardClick(cardData)}><Card card={cardData.card}/></div>)}
        </div>
    );
};

export default Hand;