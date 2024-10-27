import { PopulatedCardData } from "@data/types";
import Card from "./Card";

const Hand = ({hand, handleCardClick}:{hand: PopulatedCardData[], handleCardClick: (card:PopulatedCardData) => void}) => {

    return (
        <div className="fixed -bottom-24 w-full flex justify-center gap-2 [&>*]:transition-all hover:[&>*]:-translate-y-24 pb-1">
            {hand.map((card,i) => <div key={`card-${i}`} onClick={() => handleCardClick(card)}><Card card={card}/></div>)}
        </div>
    );
};

export default Hand;