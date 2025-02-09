import { BattleData, CardObjectData } from "@data/types";
import Card from "./card";
import { calcConnectedStats } from "@lib/game/cardUtils";

type Props = {
    battleData: BattleData;
    whoTurn: number;
    selectedCard?: CardObjectData;
    targetCard?: CardObjectData;
}

const BattleHud = ({ battleData, whoTurn, selectedCard, targetCard } : Props) => {
    const { players,
            // graveyard,
            // ended,
            // turnOrder,
            turn } = battleData;

    const whoTurnName = players.filter(p => p.id===whoTurn)[0].name;
    const isAttacking = true;

    const { newAtk:selectedNewAtk, newHp:selectedNewHp } = calcConnectedStats(selectedCard?.card);
    const { newAtk:targetNewAtk, newHp:targetNewHp } = calcConnectedStats(targetCard?.card);

    const selectedCardStats = { newAtk: selectedNewAtk, newHp: selectedCard && targetCard ? selectedCard.card.hp - targetCard.card.atk : undefined };
    const targetCardStats = { newHp: targetNewHp&&selectedNewAtk ? targetNewHp - selectedNewAtk : undefined };

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
                <div>
                    {selectedCard&&<Card card={selectedCard.card} updateStats={selectedCardStats}/>}
                </div>
                <div className="flex gap-4 p-4 pointer-events-auto">
                    <button className="dev-button" disabled={!selectedCard || selectedCard.card.atk === 0}>
                        Attack
                    </button>
                    <button className="dev-button" disabled={!selectedCard || selectedCard.card.ability!=="Bolt"}>
                        Cast
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