import { cards } from "@data/cards";

export const drawRandomCard = () => {
    // Step 1: Calculate the total weight
    const { basic } = cards;

    // Step 2: Generate a random number between 0 and the total weight

    // Step 3: Loop through the cards and subtract their weights until randomNum is reached
    const findRandomCard = () => {
        const totalWeight = Object.values(basic).reduce((sum, card) => sum + (card.weight||0), 0);
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
        return Object.values(basic)[Object.values(basic).length - 1];
    };
    const result = findRandomCard();
    
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

    return result;
}