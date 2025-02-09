import { ActionType, BattleData, CardObjectData } from "@data/types";
import Card from "./card";
import { calcConnectedStats } from "@lib/game/cardUtils";

type Props = {
    battleData: BattleData;
    whoTurn: number;
    selectedCard?: CardObjectData;
    targetCard?: CardObjectData;
    userId: number | null;
    action: ActionType;
    setAction: (action:ActionType) => void;
}

const BattleHud = ({ 
    battleData, 
    whoTurn, 
    selectedCard, 
    targetCard, 
    userId, 
    action, 
    setAction, 
} : Props) => {
    const { players,
            // graveyard,
            // ended,
            // turnOrder,
            turn } = battleData;

    const whoTurnName = players.filter(p => p.id===whoTurn)[0].name;

    const { 
        newAtk:selectedNewAtk, 
        // newHp:selectedNewHp 
    } = calcConnectedStats(selectedCard?.card);
    const { 
        // newAtk:targetNewAtk, 
        newHp:targetNewHp 
    } = calcConnectedStats(targetCard?.card);

    const selectedCardStats = { newAtk: selectedNewAtk, newHp: selectedCard && targetCard ? Math.max(selectedCard.card.hp - targetCard.card.atk, 0) : undefined };
    const targetCardStats = { newHp: targetNewHp&&selectedNewAtk ? Math.max(targetNewHp - selectedNewAtk, 0) : undefined };

    const canCast = selectedCard && whoTurn === userId && selectedCard.card.style === "Bolt";
    const canAttack = selectedCard && whoTurn === userId && selectedCard.card.atk > 0;

    return (
        <div className="fixed h-screen w-screen inset-0 z-50 pointer-events-none">
            {/* Right Sidebar */}
            <div className="absolute right-0 h-full flex flex-col justify-center">
                <div className="dev-button p-4">
                    <p>{whoTurnName}</p>
                    <p>Turn {turn}</p>
                </div>
            </div>
            {/* Bottom Bar */}
            <div className="absolute bottom-0 w-full flex items-end">
                <div className="">
                    {selectedCard&&<Card card={selectedCard.card} updateStats={selectedCardStats}/>}
                </div>
                <div className="flex gap-4 p-4 pointer-events-auto">
                    <button className={`dev-button ${canAttack && action==="attack" ? "shadow-glow-white" : ""}`} disabled={!canAttack}
                        onClick={() => canAttack && setAction("attack")}
                    >
                        Attack{action==="attack" ? "ing" : ""}
                    </button>
                    <button className={`dev-button ${canCast && action==="cast" ? "shadow-glow-white" : ""}`} disabled={!canCast}
                        onClick={() => canCast && setAction("cast")}
                    >
                        Cast{action==="cast" ? "ing" : ""}
                    </button>
                </div>
                <div className="ml-auto">
                    {targetCard&&<Card card={targetCard.card} updateStats={{newHp : targetCardStats.newHp}}/>}
                </div>
            </div>
        </div>
    )
}

export default BattleHud;