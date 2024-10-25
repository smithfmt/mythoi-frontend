import { CardData } from "@data/types";
import cardComponents from "@assets/card/cardComponents";
import Image from "next/image";

// TODO MAKE THE BACKEND GENERATE THE CONNECTIONS

const Card = ({ card } : { card: CardData }) => {
    const { img, name, atk, hp, connect, red, green, blue, type, ability, style, cost, desc } = card;
    console.log(img)
    return (
        <div className="relative z-50 w-[13rem] h-[18rem] bg-neutral-50">
            <Image className="relative z-40 h-full w-full" src={cardComponents.Border.src} width={1300} height={1800} alt="border" />
            {/* <Image className="relative z-30 h-full w-full" src={require(`/src/assets/card/images/${img}.jpeg`).src} width={800} height={800} alt="character" /> */}
        </div>
    )
};

export default Card;