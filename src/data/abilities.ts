import { addBuff, removeBuff } from "@lib/game/gameLogic";
import { AbilityType } from "./abilityTypes";

export const abilities:Record<string, AbilityType> = {
    "Strength of the Gods": {
        type: "basicPowerupEffect",
        targets: "self",
        effect: ({ casterCard: caster }) => {
            caster = addBuff([caster], caster.ability)[0];
            caster.currentAtk = caster.currentAtk + 3;
            return { effectedCasterCard: caster };
        },
        resolver: ({ card: caster }) => {
            caster = removeBuff([caster], caster.ability)[0];
            caster.currentAtk = caster.currentAtk - 3;
            return { resolvedCard: caster };
        },
        resolves: "afterAttack",
        condition: (caster) => !caster.hasAttacked,
    },
    "Medusa's Gaze": {
        type: "basicTargetableEffect",
        targets: "singleEnemy",
        effect: ({ casterCard: caster, targetCardData: target }) => {
            target = addBuff([target], caster.ability)[0];
            target.isStunned = true;
            return { effectedTargetCard: target };
        },
        resolver: ({ card }) => {
            card = removeBuff([card], "Medusa's Gaze")[0];
            card.isStunned = false;
            return { resolvedCard: card };
        },
        resolves: "stun",
    },
    "Quelling Blade": {
        type: "passiveAttackModifier",
        condition: ({ targetCard }) => {
            return targetCard.currentHp < targetCard.hp;
        },
        effect: ({ casterCard }) => {
            casterCard = addBuff([casterCard], casterCard.ability)[0];
            casterCard.currentAtk = casterCard.currentAtk + 4;
            return { effectedCasterCard: casterCard };
        },
        resolver: ({ card: caster }) => {
            caster = removeBuff([caster], caster.ability)[0];
            caster.currentAtk = caster.currentAtk - 4;
            return { resolvedCard: caster };
        },
        resolves: "afterAttack",
    }
}