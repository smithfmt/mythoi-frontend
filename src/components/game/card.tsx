/* eslint-disable @next/next/no-img-element */
import { PopulatedCardData } from "@data/types";
import cardComponents from "@assets/card/cardComponents";
import Image from "next/image";
import { CardImages } from "@assets/images";
import Default from "@assets/card/images/Spare 2.jpeg"

type Props = {
    card: PopulatedCardData; 
    shop?: boolean;
    updateStats?: {
        newAtk?: number;
        newHp?: number;
    }
}

const Card = ({ 
    card, 
    // shop, 
    updateStats 
} : Props) => {
    const { img, name, atk, hp, ability, style, cost, sides, desc } = card;
    const imageKey = `${img}.jpeg`;
    const imageData = CardImages[imageKey]?.default;
    if (!imageData) console.warn(`Image not found for key: ${imageKey}`)
    const { 
        src, 
        height, width 
    } = imageData || Default;

    const colors = {
        Str: "rgba(255,0,0,0.3)",
        Int: "rgba(1,145,226,0.45)",
        Agi:"rgba(4,186,0,0.45)",
        Mon:"rgba(15,0,20,0.8)",
        Div:"rgba(255,229,0,0.2)",
    };

    return (
        <div className="grid-stack-children relative z-50 w-[13rem] h-[18rem] bg-neutral-50 font-cinzel">
            
            <div className="relative z-20 w-full h-full p-6 overflow-hidden">

            {/* Character Image */}
                <Image className="relative z-10 w-full" src={src} width={width} height={height} alt="character" />
                {/* <img className="relative z-10 w-full" src={src} alt={"character"}/> */}
            {/* Ability */}
                <div className="relative z-30 flex w-full justify-center items-center h-2">
                    <Image className="absolute top-0 h-full z-10 brightness-90 saturate-[0.8]"  src={cardComponents.Divider.src} width={cardComponents.Divider.width} height={cardComponents.Divider.height} alt="divider" />
                    <Image className="h-10 w-10 z-20" src={cardComponents[`${style}Icon`]} width={100} height={100} alt="ability" />
                    {/* <img className="absolute top-0 h-full z-10 brightness-90 saturate-[0.8]"  src={cardComponents.Divider.src} alt="divider" />
                    <img className="h-10 w-10 z-20" src={cardComponents[`${style}Icon`].src} alt="ability" /> */}
                </div>

            {/* Card Details */}
                <div className="relative z-20 grid-stack-children">
                    <Image className="w-full h-full object-fill" src={cardComponents.Texture} width={300} height={300} alt="texture" />
                    {/* <img className="w-full h-full object-fill" src={cardComponents.Texture.src} alt="texture" /> */}
                    <div className="flex flex-col items-center  pt-3 px-2 text-cardText">
                        <h1 className="font-bold text-sm">{name}</h1>
                        <p className="text-[0.5rem] text-center"><strong>{ability}</strong>{` - ${desc}`}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            {card.ability!=="Equipment"&&<div className="absolute z-50 bottom-0 w-full flex justify-between text-neutral-50 font-black">
                <div className="grid-stack-children justify-center items-center">
                    <Image className="w-10 h-10" src={cardComponents.AtkIcon.src} height={cardComponents.AtkIcon.height} width={cardComponents.AtkIcon.width} alt="atkIcon" />
                    {/* <img className="w-10 h-10" src={cardComponents.AtkIcon.src} alt="atkIcon" /> */}
                    <p className={`text-center ${updateStats?.newAtk ? `${updateStats.newAtk > card.atk ? "text-green-400 text-glow-green" : updateStats.newAtk < card.atk ? "text-red-400 text-glow-red" : "" } font-black` : ""}`}>{updateStats?.newAtk ?? atk}</p>
                </div>
                <div className="grid-stack-children justify-center items-center">
                    <Image className="w-10 h-10" src={cardComponents.HpIcon.src} height={cardComponents.HpIcon.height} width={cardComponents.HpIcon.width} alt="hpIcon" />
                    {/* <img className="w-10 h-10" src={cardComponents.HpIcon.src} alt="hpIcon" /> */}
                    <p className={`text-center ${updateStats?.newHp ? `${updateStats.newHp > card.hp ? "text-green-400 text-glow-green" : updateStats.newHp < card.hp ? "text-red-400 text-glow-red" : "" } font-black` : ""}`}>{updateStats?.newHp ?? hp}</p>
                </div>
            </div>}

            {/* Cost */}
            {false&&<div className="relative z-20 flex gap-1 w-full justify-center pt-4">
                {cost.map((cost,i) => <div className="relative w-fit h-fit saturate-150" key={`cost-${i}`}>
                    <Image className="relative z-20 h-6 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} height={180} width={130} alt="cost"/>
                    {/* <img className="relative z-20 h-6 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} alt="cost"/> */}
                    <span style={{backgroundColor:colors[cost]}} className="absolute top-0 z-30 w-full h-full"/>
                </div>)}
            </div>}

            {/* Border */}
            <Image className="relative z-30 h-full w-full" src={cardComponents.Border.src} width={1300} height={1800} alt="border" />
            {/* <img className="relative z-30 h-full w-full" src={cardComponents.Border.src} alt="border" /> */}
            <div style={{borderTopColor:`${colors[sides.top.attribute]}`,borderRightColor:`${colors[sides.right.attribute]}`,borderBottomColor:`${colors[sides.bottom.attribute]}`,borderLeftColor:`${colors[sides.left.attribute]}`}} className="relative z-40 w-full h-full border-[1.75rem]"/>
            {sides.top.connect&&<div className={`absolute flex items-center justify-center top-0 w-full z-50`}>
                <div className="relative w-7 h-7">{sides.top.active&&<span className="absolute -top-1 -left-1 h-9 w-9 z-40 rounded-full" style={{background:colors[sides.top.attribute]}} />}
                    <Image className="relative z-30 h-full w-full" src={cardComponents[`${sides.top.attribute}Icon`]} width={100} height={100} alt="top-icon" />
                    {/* <img className="relative z-30 h-full w-full" src={cardComponents[`${sides.top.attribute}Icon`].src} alt="top-icon" /> */}
                </div>
            </div>}
            {sides.right.connect&&<div className={`absolute flex items-center justify-center flex-col right-0 h-full z-50`}>
                <div className="relative w-7 h-7">{sides.right.active&&<span className="absolute -top-1 -left-1 h-9 w-9 z-40 rounded-full" style={{backgroundColor:colors[sides.right.attribute]}} />}
                    <Image className="relative z-30 h-full w-full" src={cardComponents[`${sides.right.attribute}Icon`]} width={100} height={100} alt="right-icon" />
                    {/* <img className="relative z-30 h-full w-full" src={cardComponents[`${sides.right.attribute}Icon`].src} alt="right-icon" /> */}
                </div>
            </div>}
            {sides.left.connect&&<div className={`absolute flex items-center justify-center flex-col left-0 h-full z-50`}>
                <div className="relative w-7 h-7">{sides.left.active&&<span className="absolute -top-1 -left-1 h-9 w-9 z-40 rounded-full" style={{backgroundColor:colors[sides.left.attribute]}} />}
                    <Image className="relative z-30 h-full w-full" src={cardComponents[`${sides.left.attribute}Icon`]} width={100} height={100} alt="left-icon" />
                    {/* <img className="relative z-30 h-full w-full" src={cardComponents[`${sides.left.attribute}Icon`].src} alt="left-icon" /> */}
                </div>
            </div>}
            {sides.bottom.connect&&<div className={`absolute flex items-center justify-center bottom-0 w-full z-50`}>
                <div className="relative w-7 h-7">{sides.bottom.active&&<span className="absolute -top-1 -left-1 h-9 w-9 z-40 rounded-full" style={{backgroundColor:colors[sides.bottom.attribute]}} />}
                    <Image className="relative z-30 h-full w-full" src={cardComponents[`${sides.bottom.attribute}Icon`]} width={100} height={100} alt="bottom-icon" />
                    {/* <img className="relative z-30 h-full w-full" src={cardComponents[`${sides.bottom.attribute}Icon`].src} alt="bottom-icon" /> */}
                </div>
            </div>}
        </div>
    )
};

export default Card;