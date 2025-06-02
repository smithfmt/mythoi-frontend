import { updateManyBattleCards } from "@app/api/requests";
import { abilities } from "@data/abilities"
import { AbilityType, ResolverEvents } from "@data/abilityTypes";
import { PopulatedBattleCardData } from "@data/types";

export const findBuffsByResolveEvent = (buffs: string[], resolves: string) => {
    return buffs.map(b => abilities[b]).filter(buff => buff.resolves === resolves);
}

export const resolveAbility = async (ability: AbilityType, card: PopulatedBattleCardData, friendlyCards: PopulatedBattleCardData[], enemyCards: PopulatedBattleCardData[]) => {
    if (!ability.resolver) return;
    const { 
        resolvedCard, 
        resolvedFriendlyCards, 
        resolvedEnemyCards, 
      } = ability.resolver({card, friendlyCards, enemyCards});
    const updateCards = [
        resolvedCard,
    ...(resolvedFriendlyCards ? resolvedFriendlyCards.filter(c => c.id === resolvedCard.id) : []),
    ...(resolvedEnemyCards ?? []),
    ];
    await updateManyBattleCards(updateCards);
}
  
export const resolveAllAbilities = async (
    event: ResolverEvents, 
    friendlyCard: PopulatedBattleCardData,
    enemyCard: PopulatedBattleCardData,
    friendlyCards: PopulatedBattleCardData[],
    enemyCards: PopulatedBattleCardData[],
) => {
    switch (event) {
        case "afterAttack":
            const ability = abilities[friendlyCard.ability];
            if (friendlyCard.buffs.includes(friendlyCard.ability) && ability?.resolves === "afterAttack") {
                await resolveAbility(ability, friendlyCard, friendlyCards, enemyCards);
            }

            const targetStunned = findBuffsByResolveEvent(enemyCard.buffs, "stun");
            if (targetStunned.length) {
                targetStunned.forEach(async buff => {
                    await resolveAbility(buff,enemyCard,enemyCards,friendlyCards);
                });
            }
            break;
        case "cardMove":
            break;
        case "stun":
            break;
    }
}

export const switchCardPlaces = (teamCards: PopulatedBattleCardData[], switchCards: PopulatedBattleCardData[]) => {
    return teamCards.map(card => {
        switchCards.forEach((_, index) => {
            if (card.id === switchCards[index].id) {
                card.x = switchCards[index].x
                card.y = switchCards[index].y
            }
        });
        return card;
    })
}