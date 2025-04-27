import { PopulatedBattleCardData } from "./types";

export type BaseAbilityType = {
    name?: string;
    
    casts?: number;
    canTargetEquipment?: boolean;
}

type ResolverType = (data : { card: PopulatedBattleCardData, friendlyCards?:PopulatedBattleCardData[], enemyCards?:PopulatedBattleCardData[] }) => ({
    resolvedCard:PopulatedBattleCardData, resolvedFriendlyCards?:PopulatedBattleCardData[], resolvedEnemyCards?: PopulatedBattleCardData[],
});

type ResolverEvents = "cardMove" | "afterAttack" | "stun";

export type BasicTargetableEffect = {
    type: "basicTargetableEffect";
    targets: "singleEnemy" | "singleFriend";
    effect: (data: { casterCard:PopulatedBattleCardData, targetCardData:PopulatedBattleCardData }) => ({ 
        effectedCasterCard?: PopulatedBattleCardData, effectedTargetCard?: PopulatedBattleCardData 
    });
    condition?:(casterCard:PopulatedBattleCardData) => boolean;
    resolver: ResolverType;
    resolves: ResolverEvents;

}

export type BasicPowerupEffect = {
    type: "basicPowerupEffect";
    targets: "allEnemy" | "allFriend" | "self";
    effect: (data: { casterCard: PopulatedBattleCardData, friendlyCards:PopulatedBattleCardData[], enemyCards:PopulatedBattleCardData[] }) => ({
        effectedCasterCard:PopulatedBattleCardData, effectedFriendlyCards?:PopulatedBattleCardData[], effectedEnemyCards?:PopulatedBattleCardData[],
    });
    condition?:(casterCard:PopulatedBattleCardData) => boolean;
    resolver: ResolverType;
    resolves: ResolverEvents;
}

export type ChoiceTargetableEffect = {
    type: "choiceTargetableEffect";
    choices: AbilityType[];
}

export type PassiveAttackModifier = {
    type: "passiveAttackModifier";
    condition: (data: { casterCard:PopulatedBattleCardData, targetCard:PopulatedBattleCardData }) => boolean;
    effect: (data: { casterCard: PopulatedBattleCardData, targetCard: PopulatedBattleCardData, friendlyCards:PopulatedBattleCardData[], enemyCards:PopulatedBattleCardData[] }) => ({
        effectedCasterCard:PopulatedBattleCardData, effectedTargetCard?: PopulatedBattleCardData, effectedFriendlyCards?:PopulatedBattleCardData[], effectedEnemyCards?:PopulatedBattleCardData[],
    });
    resolver: ResolverType;
    resolves: ResolverEvents;
}

// PASSIVES , AUTOCAST etc.

export type AbilityType = BaseAbilityType & (BasicTargetableEffect | BasicPowerupEffect | ChoiceTargetableEffect | PassiveAttackModifier);