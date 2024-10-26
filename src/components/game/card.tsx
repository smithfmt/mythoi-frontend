import { CardData } from "@data/types";
import cardComponents from "@assets/card/cardComponents";
import Image from "next/image";
import { CardImages } from "@assets/images";

// TODO MAKE THE BACKEND GENERATE THE CONNECTIONS and the costs


const Card = ({ card } : { card: CardData }) => {
    const { img, name, atk, hp, connect, red, green, blue, type, ability, style, cost, desc } = card;
    const { src, height, width } = CardImages[`${img}.jpeg`].default
    const connections = {
        left: "Str",
        top: "Int",
        right: "Agi",
        bottom: "Agi",
    };
    const colors = {
        Str: "rgba(255,0,0,0.3)",
        Int: "rgba(1,145,226,0.45)",
        Agi:"rgba(4,186,0,0.45)",
        Mon:"rgba(0,0,0,0.6)",
        Div:"rgba(255,229,0,0.2)",
    };
    const { left, top, right, bottom } = connections;

    const sideColors = {
        top: top?colors[top]:right?colors[right]:left?colors[left]:bottom?colors[bottom]:colors["Mon"],
        left: left?colors[left]:top?colors[top]:bottom?colors[bottom]:right?colors[right]:colors["Mon"],
        right: right?colors[right]:top?colors[top]:bottom?colors[bottom]:left?colors[left]:colors["Mon"],
        bottom: bottom?colors[bottom]:right?colors[right]:left?colors[left]:top?colors[top]:colors["Mon"],
    }

    const costArray = [
        "Str", "Int", "Agi", "Mon", "Div"
    ]

    return (
        <div className="grid-stack-children relative z-50 w-[13rem] h-[18rem] bg-neutral-50 font-cinzel">
            
            <div className="relative z-20 w-full h-full p-6 overflow-hidden">

            {/* Character Image */}
                <Image className="relative z-10 w-full" src={src} width={width} height={height} alt="character" />

            {/* Ability */}
                <div className="relative z-30 flex w-full justify-center items-center h-2">
                    <Image className="absolute top-0 h-full z-10 brightness-90 saturate-[0.8]"  src={cardComponents.Divider.src} width={cardComponents.Divider.width} height={cardComponents.Divider.height} alt="divider" />
                    <Image className="h-10 w-10 z-20" src={cardComponents[`${style}Icon`]} width={100} height={100} alt="ability" />
                </div>

            {/* Card Details */}
                <div className="relative z-20 grid-stack-children">
                    <Image className="w-full h-full object-fill" src={cardComponents.Texture} width={300} height={300} alt="texture" />
                    <div className="flex flex-col items-center  pt-3 px-2 text-cardText">
                        <h1 className="font-bold text-sm">{name}</h1>
                        <p className="text-[0.5rem] text-center"><strong>{ability}</strong>{` - ${desc}`}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="absolute z-50 bottom-0 w-full flex justify-between text-neutral-50 font-black">
                <div className="grid-stack-children justify-center items-center">
                    <Image className="w-10 h-10" src={cardComponents.AtkIcon.src} height={cardComponents.AtkIcon.height} width={cardComponents.AtkIcon.width} alt="atkIcon" />
                    <p className="text-center">{atk}</p>
                </div>
                <div className="grid-stack-children justify-center items-center">
                    <Image className="w-10 h-10" src={cardComponents.HpIcon.src} height={cardComponents.HpIcon.height} width={cardComponents.HpIcon.width} alt="hpIcon" />
                    <p className="text-center">{hp}</p>
                </div>
            </div>

            {/* Cost */}
            <div className="relative z-20 flex gap-1 w-full justify-center pt-4">
                {costArray.map((cost,i) => <div className="relative w-fit h-fit saturate-150" key={`cost-${i}`}>
                    <Image className="relative z-20 h-6 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} height={180} width={130} alt="cost"/>
                    <span style={{backgroundColor:colors[cost]}} className="absolute top-0 z-30 w-full h-full"/>
                </div>)}
            </div>

            {/* Border */}
            <Image className="relative z-30 h-full w-full" src={cardComponents.Border.src} width={1300} height={1800} alt="border" />
            <div style={{borderTopColor:`${sideColors.top}`,borderRightColor:`${sideColors.right}`,borderBottomColor:`${sideColors.bottom}`,borderLeftColor:`${sideColors.left}`}} className="relative z-40 w-full h-full border-[1.75rem]"/>
            {top&&<div className="absolute flex justify-center top-0 w-full z-50"><Image className="h-7 w-7" src={cardComponents[`${top}Icon`]} width={100} height={100} alt="top-icon" /></div>}
            {right&&<div className="absolute flex justify-center flex-col right-0 h-full z-50"><Image className="h-7 w-7" src={cardComponents[`${right}Icon`]} width={100} height={100} alt="right-icon" /></div>}
            {left&&<div className="absolute flex justify-center flex-col left-0 h-full z-50"><Image className="h-7 w-7" src={cardComponents[`${left}Icon`]} width={100} height={100} alt="left-icon" /></div>}
            {bottom&&<div className="absolute flex justify-center bottom-0 w-full z-50"><Image className="h-7 w-7" src={cardComponents[`${bottom}Icon`]} width={100} height={100} alt="bottom-icon" /></div>}
        </div>
    )
};

export default Card;