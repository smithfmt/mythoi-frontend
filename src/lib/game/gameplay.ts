import { cards } from "@data/cards";
import { PlayerData, Space } from "@data/types";
import { findIndexByParam } from "@utils/helpers";
import { generateCard } from "./cardUtils";

export const drawBasicCard = () => {
    // Step 1: Calculate the total weight
    const { basic } = cards;

    // Step 2: Generate a random number between 0 and the total weight

    // Step 3: Loop through the cards and subtract their weights until randomNum is reached
    const findRandomCard = () => {
        const totalWeight = basic.reduce((sum, card) => sum + (card.weight||0), 0);
        const randomNum = Math.random() * totalWeight;

    // Step 3: Loop through the cards and subtract their weights until randomNum is reached
        let cumulativeWeight = 0;
        for (const card of Object.values(basic)) {
            cumulativeWeight += (card.weight||0);
            if (randomNum < cumulativeWeight) {
                return card;
            }
        }
        // Fallback in case of rounding errors
        return basic[basic.length - 1];
    };
    const result = {...findRandomCard()};
    // Add random attributes
    for (let i=0; i<result.connect;i++) {
        switch (Math.floor(Math.random()*3)) {
            case 0:
                result.red++;
                break;
            case 1:
                result.green++;
                break;
            default:
                result.blue++;
                break;
        };
    };

    return generateCard(result);
}

export const placeCard = (playerData: PlayerData, uid: string, space: Space,): [PlayerData | null, string | null] => {
    const { x, y, hand } = space;

    // Check if the Space is filled
    const isFilled = !!playerData.cards.filter(card => card.x===x&&card.y===y).length;
    if (isFilled) return [null, "Space is already filled"];

    // Check if Card Exists
    const cardIndex = findIndexByParam(playerData.cards, ["card", "uid"], uid);
    if (cardIndex===undefined) return [null, "Card not found"];
    const currentCard = playerData.cards[cardIndex];

    // Set Card's new position
    Object.assign(currentCard, { x, y, hand });
    
    return [playerData, null];
}


