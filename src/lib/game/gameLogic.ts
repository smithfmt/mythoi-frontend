import { PopulatedBattleCardData, PopulatedCardData } from "@data/types";
import { deepEqual } from "@utils/helpers";
import { extractCardValue } from "./cardUtils";
import { AbilityType } from "@data/abilityTypes";
import { updateManyBattleCards } from "@app/api/requests";


const getMinMaxCoordinates = (board: PopulatedCardData[]): [[number, number], [number, number]] => {
    // Initialize min and max values with the first element's x and y
    let minX = board[0]?.x ?? 0;
    let maxX = minX;
    let minY = board[0]?.y ?? 0;
    let maxY = minY;

    for (const { x, y } of board) {
        if (!x || !y) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    return [[minX, maxX], [minY, maxY]];
}

const dirMap = {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top",
};

export const getAdjacentCards = (board:PopulatedCardData[], x:number, y:number) => {
    return board.map(card => {
        if (card.y===y) {
            if (card.x===x+1) return { ...card, dir: "right" };
            if (card.x===x-1) return { ...card, dir: "left" };
            return null;
        }
        if (card.x===x) {
            if (card.y===y+1) return { ...card, dir: "bottom" };
            if (card.y===y-1) return { ...card, dir: "top" };
            return null;
        }
        return null;
    }).filter(card => !!card);
}

export const getPlaceableSpaces = (cards:PopulatedCardData[], selectedCard:PopulatedCardData) => {
    const board = cards.filter(c => c.x!==undefined&&c.y!==undefined);
    if (board.length===0) return [{x:5,y:5}];
    const [[minX, maxX,], [minY, maxY]] = getMinMaxCoordinates(board)
    const result:{x:number,y:number}[] = [];
    for (let x=minX-1;x<maxX+2;x++) {
        for (let y=minY-1;y<maxY+2;y++) {
            const isFilled = !!board.filter(card => card.x===x&&card.y===y).length;
            if (!isFilled) {
                const adjacentCards = getAdjacentCards(board,x,y);
                if (adjacentCards.length) {
                    let allBlanks = true;
                    const connectionsMatch = adjacentCards.reduce((prev, cur) => {
                        // If the selected card's connection with the adjacent card matches (blank & blank || connect & connect), pass
                        if (prev && selectedCard[cur.dir].connect===cur[dirMap[cur.dir]].connect) {  
                        // Ensure that not all connections with adjacent cards are blanks
                            if (selectedCard[cur.dir].connect) allBlanks = false;
                            return true;
                        };
                        return false;
                    }, true);
                    if (!allBlanks && connectionsMatch) result.push({x,y})
                }
            }
        }
    }
    
    return result
}

export const checkValidBoard = (board:PopulatedCardData[]) => {
    if (board.length===1) {
        // Allow one card if it is the general
        if (board[0].type==="general") return { success: true };
    }
    // Check if General is in the hand
    if (!board.filter(card => card.type==="general").length) return { success: false, error: "You must have your general on the board" };
    if (board.length>10) return { success: false, error: "The maximum cards on the board is 10" }
    let isValid = true;
    const invalidCards:{ card:string, error?:string }[] = [];
    board.forEach(card => {
        if (!isValid) return;
        const { x, y } = card;
        if (!x || !y) return;
        const adjacentCards = getAdjacentCards(board,x,y);
        // If a card is isolated (no adjacent cards)
        if (!adjacentCards.length) return (isValid = false, invalidCards.push({ card: card.uid, error: "Card cannot be isolated" }));
        
        let allBlanks = true;
        const connectionsMatch = adjacentCards.reduce((prev, cur) => {
            // If the selected card's connection with the adjacent card matches (blank & blank || connect & connect), pass
            if (prev && card[cur.dir].connect===cur[dirMap[cur.dir]].connect) {  
            // Ensure that not all connections with adjacent cards are blanks
                if (card[cur.dir].connect) allBlanks = false;
                return true;
            };
            return false;
        }, true);
        // If a card is only connected by blanks
        if (allBlanks) return (isValid=false, invalidCards.push({ card: card.uid, error: "Card Is not connected" }));
        // If a card is not connected correctly (connect > blank)
        if (!connectionsMatch) return (isValid=false, invalidCards.push({ card: card.uid, error: "Card Is not connected correctly" }));

        // Any more validation
    });
    // Cards in closed loop (two separate groups)
    let checkedCards = [board[0]];
    while (checkedCards.length<board.length) {
        const changes:(PopulatedCardData & { dir: string })[] = [];
        checkedCards.forEach(card => {
            const { x,y } = card;
            if (!x || !y) return;
            const adjacentCards = getAdjacentCards(board,x,y);
            adjacentCards.forEach(adjCard => {
                if (
                    // If the Adjacent Card has been checked, Skip.
                    !checkedCards.filter(c => c.uid === adjCard.uid).length && 
                    // If the Adjacent Card is Connected to the current checked card, add to checked cards
                    card[adjCard.dir].connect&&adjCard[dirMap[adjCard.dir]].connect
                ) {
                    changes.push(adjCard)
                }
            });
        })
        if (!changes.length) return { success: false, error: "Cards must all be connected", invalidCards };
        checkedCards = [...checkedCards,...changes];
    }
    return { success: isValid, invalidCards };
}

export const addActiveConnections = (cards:PopulatedCardData[]|PopulatedBattleCardData[]) => {
    const board = cards.filter(c => !c.inHand);
    const updatedCards = cards.map(card => {
        const { x,y,inHand } = card;
        const sides = Object.keys(dirMap);
        if (inHand||!x||!y) {
            sides.forEach(side => card[side].active = false);
            return card;
        }
        // Override for Monsters : TODO - add an exception for MELEAGER
        if (card.type==="monster") {
            sides.forEach(side => card[side].active = false);
            return card;
        }
        const adjacentCards = getAdjacentCards(board,x,y);
        sides.forEach(side => {
            const adjacentCard = adjacentCards.filter(c => c.dir===side)[0];
            if (adjacentCard&&adjacentCard.type==="monster") {
                card[side].active = false;
            } else if (adjacentCard&&(adjacentCard.type==="god"||card.type==="god")) {
                card[side].active = true;
            } else {
                card[side].active = !!(adjacentCard&&adjacentCard[dirMap[side]].attribute===card[side].attribute);
            }
        });
        return card;
    })
    return updatedCards;
}

export const clearConnections = (card:PopulatedCardData | PopulatedBattleCardData) => {
    const sides = Object.keys(dirMap);
    sides.forEach(side => card[side] ? card[side].active = false : "");
    return card;
}

export const validatePlayerCards = (Old: PopulatedCardData[], New: PopulatedCardData[]) => {
    let result = true;
    New.forEach(newCard => {
        const oldCard = Old.filter(oldCard => oldCard.uid===newCard.uid)[0];
        if (!oldCard || !deepEqual(oldCard, newCard, ["top.active","right.active","left.active","bottom.active", "x", "y", "inHand"])) {
            result = false;
        } 
    });
    return result;
}

export const validatePayment = (
    cardToBuy: PopulatedCardData,
    payment: PopulatedCardData[]
) => {
    if (["monster", "god"].includes(cardToBuy.type)) {
      return {
        success: cardToBuy.cost.length === payment.length,
        match: cardToBuy.cost.slice(0, payment.length),
      };
    }
  
    const paymentCards = payment.map((c) => extractCardValue(c));
    const costArray = cardToBuy.cost;
  
    // Helper function to validate a specific order of payment cards
    const validateOrder = (cards: string[][]): { success: boolean; match: (string | null)[] } => {
      const availableCards = [...cards];
      const match: (string | null)[] = [];
  
      for (const cost of costArray) {
        const cardIndex = availableCards.findIndex((card) => card.includes(cost));
  
        if (cardIndex === -1) {
          // If no card can pay for the current cost, add null to the match array.
          match.push(null);
        } else {
          // Add the matched card value to the match array.
          match.push(cost);
  
          // Remove the used card from the list of available cards.
          availableCards.splice(cardIndex, 1);
        }
      }
  
      const success = !match.includes(null) && availableCards.length >= 0;
      return { success, match };
    };
  
    // Check the original order of payment cards first
    const result = validateOrder(paymentCards);
  
    if (result.success) {
      return result; // If the original order works, return it
    }
  
    // Helper function to generate all permutations of an array
    const getPermutations = (array: string[][]): string[][][] => {
      if (array.length === 0) return [[]];
      return array.flatMap((value, index) =>
        getPermutations([...array.slice(0, index), ...array.slice(index + 1)]).map((perm) => [value, ...perm])
      );
    };
  
    // Test all permutations of the payment cards
    const permutations = getPermutations(paymentCards);
    let bestMatch: (string | null)[] = [];
    let maxMatches = 0;
  
    for (const perm of permutations) {
      const attempt = validateOrder(perm);
      const matchedCount = attempt.match.filter((item) => item !== null).length;
  
      if (matchedCount > maxMatches) {
        maxMatches = matchedCount;
        bestMatch = attempt.match;
      }
  
      if (attempt.success) {
        return attempt; // Return the first valid permutation
      }
    }
  
    // If no valid permutation is found, return the best possible match
    return {
      success: false,
      match: bestMatch,
    };
};

export const addBuff = (cards: PopulatedBattleCardData[], buff: string) => {
    return cards.map(card => ({
        ...card, 
        buffs: card.buffs.includes(buff) ? card.buffs : [...card.buffs, buff],
    }));
}

export const removeBuff = (cards: PopulatedBattleCardData[], buff: string) => {
    return cards.map(card => ({
        ...card, 
        buffs: card.buffs.filter(b => b !== buff),
    }));
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
  