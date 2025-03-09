import { cards } from "@data/cards";
import { PlayerData, PopulatedCardData, Space } from "@data/types";
import { findIndexByParam } from "@utils/helpers";
import { generateCard } from "./cardUtils";
import prisma from '@prisma/prismaClient';
import { addActiveConnections, clearConnections } from "./gameLogic";
import { findBattleCardsByParams, updateManyBattleCards } from "@app/api/requests";

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
                result.red = (result.red||0) + 1;
                break;
            case 1:
                result.green = (result.green||0) + 1;
                break;
            default:
                result.blue = (result.blue||0) + 1;
                break;
        };
    };

    return { ...generateCard(result), inHand: true };
}

export const placeCard = (playerData: PlayerData, uid: string, space: Space): [PlayerData | null, string | null] => {
    const { x, y, inHand } = space;

    // Check if the Space is filled
    const isFilled = !!playerData.cards.filter(card => card.x===x&&card.y===y).length;
    if (isFilled) return [null, "Space is already filled"];

    // Check if Card Exists
    const cardIndex = findIndexByParam(playerData.cards, ["uid"], uid);
    if (cardIndex===undefined) return [null, "Card not found"];
    const currentCard = playerData.cards[cardIndex];

    // Set Card's new position
    Object.assign(currentCard, { x, y, inHand });
    
    return [playerData, null];
}

export const returnToHand = (card: PopulatedCardData) => {
    return { ...clearConnections(card), inHand: true, x: undefined, y: undefined };
}

export const sendToGraveyard = (playerData: PlayerData, cardUid: string, graveyard: { card:PopulatedCardData, playerId:number }[]) => {
    const newGraveyard = [...graveyard, { card: playerData.cards.filter(cardData => cardData.uid === cardUid)[0], playerId: playerData.id }];
    const filteredCards = playerData.cards.map(cardData => cardData.uid === cardUid ? returnToHand(cardData) : cardData);
    const newCards = addActiveConnections(filteredCards);
    return {
        updatedPlayerData: { ...playerData, cards: newCards },
        graveyard: newGraveyard,
    }
}

export const sendCardToGraveyard = async (battleCardId:number) => {
    await prisma.battleCard.update({ 
        where: { id: battleCardId },
        data: {
            inGraveyard: true,
        },
    });
}

export const sendDeadToGraveyard = async (playerId: number, oponentId: number, battleId: number) => {
    const playerCards = await prisma.battleCard.findMany({
        where: { playerId, battleId },
    });
    const oponentCards = await prisma.battleCard.findMany({
        where: {
            playerId: oponentId,
            battleId,
        },
    });

    [...playerCards, ...oponentCards].forEach(battlecard => {
        if (battlecard.currentHp<=0) {
            sendCardToGraveyard(battlecard.id)
        }
    })
};

export const updateConnectionsForPlayers = async (playerId: number, oponentId: number, battleId: number) => {
    const [playerCards, oponentCards] = await Promise.all([
        findBattleCardsByParams({
            playerId,
            battleId,
            inGraveyard: false,
            inHand: false,
            inDiscardPile: false,
        }),
        findBattleCardsByParams({
            playerId: oponentId,
            battleId,
            inGraveyard: false,
            inHand: false,
            inDiscardPile: false,
        }),
    ]);

    const [connectedPlayerCards, connectedOponentCards] = [
        addActiveConnections(playerCards),
        addActiveConnections(oponentCards),
    ];

    await updateManyBattleCards([connectedPlayerCards,...connectedOponentCards]);
}