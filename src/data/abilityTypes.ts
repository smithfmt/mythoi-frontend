import { PopulatedBattleCardData } from "./types";

export type BaseAbilityType = {
    name?: string;
    condition?:(casterCard:PopulatedBattleCardData) => boolean;
}

export type BasicTargetableEffect = {
    type: "basicTargetableEffect";
    targets: "singleEnemy" | "singleFriend";
    effect: (casterCard:PopulatedBattleCardData, targetCardData?:PopulatedBattleCardData) => ({ 
        effectedCasterCard: PopulatedBattleCardData, effectedTargetCard?: PopulatedBattleCardData 
    });
}

export type BasicPowerupEffect = {
    type: "basicPowerupEffect"
    targets: "allEnemy" | "allFriend" | "self";
    effect: (casterCard: PopulatedBattleCardData, friendlyCards?:PopulatedBattleCardData[], enemyCards?:PopulatedBattleCardData[]) => ({
        effectedCasterCard:PopulatedBattleCardData, effectedFriendlyCards?:PopulatedBattleCardData[], effectedEnemyCards?:PopulatedBattleCardData[],
    });
    resolver?: (casterCard: PopulatedBattleCardData, friendlyCards?:PopulatedBattleCardData[], enemyCards?:PopulatedBattleCardData[]) => ({
        resolvedCasterCard:PopulatedBattleCardData, resolvedFriendlyCards?:PopulatedBattleCardData[], resolvedEnemyCards?: PopulatedBattleCardData[],
    });
    resolves?: "afterAttack" | "cardMove" | "endTurn";
}

export type ChoiceTargetableEffect = {
    type: "choiceTargetableEffect";
    choices: AbilityType[];
}

// PASSIVES , AUTOCAST etc.

export type AbilityType = BaseAbilityType & (BasicTargetableEffect | BasicPowerupEffect | ChoiceTargetableEffect);