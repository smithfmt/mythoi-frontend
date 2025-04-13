import { PopulatedBattleCardData } from "./types";

export type BasicTargetableEffect = {
    type: "basicTargetableEffect";
    name?: string;
    targets: "singleEnemy" | "singleFriend";
    effect: (casterCard:PopulatedBattleCardData, targetCardData?:PopulatedBattleCardData) => ({ 
        effectedCasterCard: PopulatedBattleCardData, effectedTargetCard?: PopulatedBattleCardData 
    });
}

export type BasicPowerupEffect = {
    type: "basicPowerupEffect"
    name?: string;
    targets: "allEnemy" | "allFriend" | "self";
    effect: (casterCard: PopulatedBattleCardData, friendlyCards?:PopulatedBattleCardData[], enemyCards?:PopulatedBattleCardData[]) => ({
        effectedCasterCard:PopulatedBattleCardData, effectedFriendlyCards?:PopulatedBattleCardData[], effectedEnemyCards?:PopulatedBattleCardData[],
    });
}

export type ChoiceTargetableEffect = {
    type: "choiceTargetableEffect";
    choices: AbilityType[];
}

// PASSIVES , AUTOCAST etc.

export type AbilityType = BasicTargetableEffect | BasicPowerupEffect;