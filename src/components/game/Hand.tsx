import { PopulatedCardData } from "@data/types";
import Card from "./Card";

const Hand = ({hand}:{hand: PopulatedCardData[]}) => {
    console.log(hand)
    return (
        <div className="fixed -bottom-24 w-full flex justify-center gap-2 [&>*]:transition-all hover:[&>*]:-translate-y-24 pb-1">
            {hand.map(card => <Card key={card.id} card={card}/>)}
        </div>
    );
};

export default Hand;