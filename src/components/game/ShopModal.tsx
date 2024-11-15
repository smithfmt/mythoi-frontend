import { useState } from "react";
import Card from "./Card";
import Image from "next/image";
import cardComponents from "@assets/card/cardComponents";
import { PopulatedCardData } from "@data/types";

const colors = {
    Str: "rgba(255,0,0,0.3)",
    Int: "rgba(1,145,226,0.45)",
    Agi:"rgba(4,186,0,0.45)",
    Mon:"rgba(0,0,0,0.6)",
    Div:"rgba(255,229,0,0.2)",
};

const ShopModal = ({ shopCards, shopOpen, setShopOpen, hand }) => {
    const [selected, setSelected] = useState<PopulatedCardData | null>(null);
    const [payment, setPayment] = useState<PopulatedCardData[]>([])
    const handleClick = (card) => {
        console.log("clicking!",card)
        setSelected(card);
    }

    const handleClickOutside = () => {
        setSelected(null);
        setShopOpen(false)
    }

    const handleBuyCard = () => {
        console.log("buying", selected);
    }

    const handlePaymentClick = (card) => {
        const inPayment = payment.filter(c => c.uid===card.uid).length;
        if (inPayment) return setPayment(payment.filter(c => c.uid!==card.uid));
        setPayment([...payment,card]);
    }

    const checkPayment = () => {
        // Compare selected.cost to payment
    }
    
    return (
        <div onClick={handleClickOutside} className={`fixed w-full h-full bg-neutral-900 bg-opacity-80 flex justify-center items-center transition-all z-[100] cursor-pointer ${shopOpen?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`}>
            <div onClick={(e) => e.stopPropagation()} className="relative z-50 pointer-events-auto cursor-auto flex justify-between w-full">
                <div className="flex flex-col flex-wrap max-h-[100vh] w-[40%] pt-16 px-16 gap-x-0 ">
                    {hand&&hand.map((cardData,i) => (<div onClick={() => handlePaymentClick(cardData.card)} key={`shopHand-${i}`} className={`${payment.filter(c => c.uid===cardData.card.uid).length?"":"brightness-50 hover:brightness-75"}  transition-all cursor-pointer`}>
                        <Card card={cardData.card} shop={true}/>
                    </div>))}
                </div>
                <div className="flex flex-col items-center p-16">
                    <div className="text-3xl font-black text-neutral-50 text-center mb-16">
                        <h1>Hero Shop</h1>
                    </div>
                    <div className="flex gap-16 justify-center">
                        {shopCards.map((card, i) => (
                            <div className={` ${selected?.uid===card.uid?"outline outline-4  outline-blue-400 -translate-y-4":""} cursor-pointer hover:-translate-y-1 transition-all`} onClick={() => handleClick(card)} key={`shopCard-${i}`}>
                                <Card card={card} shop={false}/>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2 p-16">
                        {selected&&selected.cost.map((cost,i) => <div className="relative w-fit h-fit saturate-150" key={`cost-${i}`}>
                            <Image className="relative z-20 h-24 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} height={180} width={130} alt="cost"/>
                            <span style={{backgroundColor:colors[cost]}} className="absolute top-0 z-30 w-full h-full"/>
                        </div>)}
                    </div>
                    <div className="">
                        <button onClick={handleBuyCard} className="border border-neutral-50 rounded-lg p-4 bg-neutral-900 text-neutral-50 hover:bg-neutral-800 transition-all">
                            Buy Card
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ShopModal;