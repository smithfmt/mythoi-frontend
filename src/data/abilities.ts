import { addBuff, removeBuff } from "@lib/game/gameLogic";
import { AbilityType } from "./abilityTypes";

export const abilities:Record<string, AbilityType> = {
    "Strength of the Gods": {
        type: "basicPowerupEffect",
        targets: "self",
        effect: (caster) => {
            caster = addBuff([caster], caster.ability)[0];
            caster.currentAtk = caster.currentAtk + 3;
            return { effectedCasterCard: caster };
        },
        resolver: (caster) => {
            caster = removeBuff([caster], caster.ability)[0];
            caster.currentAtk = caster.currentAtk - 3;
            return { resolvedCasterCard: caster };
        },
        resolves: "endTurn",
        condition: (caster) => !caster.hasAttacked,
    }
}