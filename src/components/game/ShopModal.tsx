import { useState } from "react";
import Card from "./Card";
import Image from "next/image";
import cardComponents from "@assets/card/cardComponents";
import { CardObjectData, PlayerData, PopulatedCardData } from "@data/types";
import { extractCardValue } from "@lib/game/cardUtils";
import { validatePayment } from "@lib/game/gameLogic";
import { useErrorHandler } from "@components/providers/ErrorContext";
import { updateGameById } from "@app/requests";
import handleError from "@utils/handleError";
import { useLoading } from "@components/providers/LoadingContext";

const colors = {
    Str: "rgba(255,0,0,0.3)",
    Int: "rgba(1,145,226,0.45)",
    Agi:"rgba(4,186,0,0.45)",
    Mon:"rgba(0,0,0,0.6)",
    Div:"rgba(255,229,0,0.2)",
};

type Props = {
    isYourTurn:boolean, 
    playerData:PlayerData, 
    shopCards:PopulatedCardData[], 
    shopOpen:boolean, 
    setShopOpen: (shopOpen:boolean) => void, 
    hand: CardObjectData[], 
    gameId: number,
}

const ShopModal = ({ isYourTurn, playerData, shopCards, shopOpen, setShopOpen, hand, gameId }:Props) => {
    const [selected, setSelected] = useState<PopulatedCardData | null>(null);
    const [payment, setPayment] = useState<PopulatedCardData[]>([]);
    
    const { startLoading, stopLoading } = useLoading();
    const { addError } = useErrorHandler();
    const handleClick = (card) => {
        setPayment([]);
        if (selected?.uid===card.uid) return setSelected(null);
        setSelected(card);
    }

    const handleBuyCard = async () => {
        if (!selected) return;
        const { success } = validatePayment(selected,payment);
        if (!success) return addError({ message: "Payment unsuccessful" });
        startLoading()
        try {
            await updateGameById(gameId, "buyCard", { payment:payment.map(card => card.uid), card:selected, playerData });
            setSelected(null);
            setShopOpen(false);
        } catch (error: unknown) {
            addError(handleError(error));
        } finally {
            stopLoading();
        }
    }

    const handlePaymentClick = (card) => {
        if (!selected) return;
        const inPayment = payment.filter(c => c.uid===card.uid).length;
        if (inPayment) return setPayment(payment.filter(c => c.uid!==card.uid));
        if (payment.length===selected.cost.length) return;
        setPayment([...payment,card]);
    }

    const closeShop = () => {
        setSelected(null);
        setPayment([]);
        setShopOpen(false);
    }

    const cardsToDisplay = selected&&hand ? ["monster", "god"].includes(selected.type) ? hand.filter(c => c.card.type!=="general") : hand.filter(c => extractCardValue(c.card).filter((atr) => selected.cost.includes(atr)).length) : hand?.filter(c => c.card.type!=="general") || [];
    const { success, match } = selected ? validatePayment(selected,payment) : { success:false, match:[] };
    return (
        <div className={`fixed w-full h-full bg-neutral-900 bg-opacity-80 flex justify-center items-center transition-all z-[100] cursor-pointer ${shopOpen?"opacity-100 pointer-events-auto":"hidden"}`}>
            <button onClick={closeShop} className="absolute top-0 right-0 w-16 h-16 bg-neutral-800 border border-neutral-50 text-neutral-50 rounded-lg flex justify-center items-center text-xl hover:bg-neutral-900 transition-all hover:text-neutral-200 z-[100]">x</button>
            <div className="relative z-50 pointer-events-auto cursor-auto flex justify-between w-full">
                {/* Cards in Hand */}
                <div className="flex flex-col flex-wrap max-h-[100vh] w-[40%] pt-16 px-16 gap-x-0 ">
                    {cardsToDisplay.map((cardData,i) => (<div onClick={() => handlePaymentClick(cardData.card)} key={`shopHand-${i}`} className={`${payment.filter(c => c.uid===cardData.card.uid).length?"":`brightness-50 ${payment.length===selected?.cost.length?"":"hover:brightness-75"}`}  transition-all cursor-pointer`}>
                        <Card card={cardData.card} shop={true}/>
                    </div>))}
                </div>
                <div className="flex flex-col items-center p-16">
                    <div className="text-3xl font-black text-neutral-50 text-center mb-16">
                        <h1>Hero Shop</h1>
                    </div>
                    {/* Heroes in Shop */}
                    <div className="flex gap-16 justify-center">
                        {shopCards&&shopCards.map((card, i) => (
                            <div key={`shopCard-${i}`} className="flex flex-col gap-2">
                                <div className={` ${selected?.uid===card.uid?"outline outline-4  outline-blue-400 -translate-y-4":""} cursor-pointer hover:-translate-y-1 transition-all`} onClick={() => handleClick(card)} >
                                    <Card card={card} shop={true}/>
                                </div>
                                <div className="flex justify-center gap-1">
                                    {card.cost.map((cost,i) => <div className="relative w-fit h-fit saturate-150" key={`cost-${i}`}>
                                        <Image className="relative z-20 h-12 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} height={180} width={130} alt="cost"/>
                                        <span style={{backgroundColor:colors[cost]}} className="absolute top-0 z-30 w-full h-full"/>
                                    </div>)}
                                </div>
                            </div>
                            
                        ))}
                    </div>
                    {/* Cost of Selected */}
                    <div className="flex justify-center gap-2 p-16">
                        {selected&&selected.cost.map((cost,i) => <div className={`relative w-fit h-fit saturate-150 transition-all ${match[i] ? "brightness-100" : "brightness-50"}`} key={`cost-${i}`}>
                            <Image className="relative z-20 h-24 w-fit object-contain bg-neutral-100" src={cardComponents.Border.src} height={180} width={130} alt="cost"/>
                            <span style={{backgroundColor:colors[cost]}} className="absolute top-0 z-30 w-full h-full"/>
                        </div>)}
                    </div>
                    {/* Shop Controls */}
                    <div className="">
                        {isYourTurn&&<button onClick={handleBuyCard} className={`border rounded-lg p-4 ${success ? "text-neutral-50 border-neutral-50 hover:bg-neutral-800" : "text-neutral-400 border-neutral-400"} bg-neutral-900 transition-all`}>
                            Buy Card
                        </button>}
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ShopModal;

