import { addActiveConnections, addBuff, checkValidBoard, removeBuff } from "@lib/game/gameLogic";
import { AbilityType } from "./abilityTypes";
import { switchCardPlaces } from "@lib/game/abilityUtils";

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
        condition: ({ casterCard: caster }) => !caster.hasAttacked,
    },
    "Medusa's Gaze": {
        type: "basicTargetableEffect",
        targets: "singleEnemy",
        effect: ({ casterCard: caster, targetCard: target }) => {
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
        charges: 2,
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
    },
    // "Heroic Connections": {},
    "Set Trap": {
        type: "choiceTargetableEffect",
        choices: [
            {
                type: "basicTargetableEffect",
                targets: "singleEnemy",
                effect: ({ casterCard: caster, targetCard: target }) => {
                    target = addBuff([target], caster.ability)[0];
                    target.isStunned = true;
                    return { effectedTargetCard: target };
                },
                resolver: ({ card }) => {
                    card = removeBuff([card], "Set Trap")[0];
                    card.isStunned = false;
                    return { resolvedCard: card };
                },
                resolves: "stun",
            }, 
            {
                type: "basicTargetableEffect",
                targets: "singleEnemy",
                effect: ({ targetCard: target }) => {
                    target.currentHp = target.currentHp-2;
                    return { effectedTargetCard: target };
                },
            },
            {
                type: "basicSwitchEffect",
                effect:({ switchCards, teamCards }) => {
                    const switchedTeamCards = switchCardPlaces(teamCards, switchCards);
                    const { success } = checkValidBoard(switchedTeamCards);
                    if (!success) return { switchedCards: teamCards };
                    const connectedCards = addActiveConnections(switchedTeamCards);
                    return { switchedCards: connectedCards };
                }
            }
        ]
    }

}