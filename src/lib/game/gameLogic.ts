import { BoardType, CardObjectData, PlayerData, PopulatedCardData } from "@data/types";
import { deepEqual } from "@utils/helpers";
import { extractCardValue } from "./cardUtils";


const getMinMaxCoordinates = (board: BoardType): [[number, number], [number, number]] => {
    // Initialize min and max values with the first element's x and y
    let minX = board[0]?.x ?? 0;
    let maxX = minX;
    let minY = board[0]?.y ?? 0;
    let maxY = minY;

    for (const { x, y } of board) {
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

const getAdjacentCards = (board:BoardType, x:number, y:number) => {
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

export const getPlaceableSpaces = (cards:CardObjectData[], selectedCard:PopulatedCardData) => {
    const board = cards.filter(c => c.x!==undefined&&c.y!==undefined) as BoardType;
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
                        if (prev && selectedCard.sides[cur.dir].connect===cur.card.sides[dirMap[cur.dir]].connect) {  
                        // Ensure that not all connections with adjacent cards are blanks
                            if (selectedCard.sides[cur.dir].connect) allBlanks = false;
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

export const checkValidBoard = (board:BoardType) => {
    if (board.length===1) {
        // Allow one card if it is the general
        if (board[0].card.type==="general") return { success: true };
    }
    // Check if General is in the hand
    if (!board.filter(cardData => cardData.card.type==="general").length) return { success: false, error: "You must have your general on the board" };
    if (board.length>10) return { success: false, error: "The maximum cards on the board is 10" }
    let isValid = true;
    const invalidCards:{ card:string, error?:string }[] = [];
    board.forEach(cardData => {
        if (!isValid) return;
        const { x, y } = cardData;
        const adjacentCards = getAdjacentCards(board,x,y);
        // If a card is isolated (no adjacent cards)
        if (!adjacentCards.length) return (isValid = false, invalidCards.push({ card:cardData.card.uid, error: "Card cannot be isolated" }));
        
        let allBlanks = true;
        const connectionsMatch = adjacentCards.reduce((prev, cur) => {
            // If the selected card's connection with the adjacent card matches (blank & blank || connect & connect), pass
            if (prev && cardData.card.sides[cur.dir].connect===cur.card.sides[dirMap[cur.dir]].connect) {  
            // Ensure that not all connections with adjacent cards are blanks
                if (cardData.card.sides[cur.dir].connect) allBlanks = false;
                return true;
            };
            return false;
        }, true);
        // If a card is only connected by blanks
        if (allBlanks) return (isValid=false, invalidCards.push({ card: cardData.card.uid, error: "Card Is not connected" }));
        // If a card is not connected correctly (connect > blank)
        if (!connectionsMatch) return (isValid=false, invalidCards.push({ card: cardData.card.uid, error: "Card Is not connected correctly" }));

        // Any more validation
    });
    // Cards in closed loop (two separate groups)
    let checkedCards = [board[0]];
    while (checkedCards.length<board.length) {
        const changes:{
            dir: string;
            card: PopulatedCardData;
            x: number;
            y: number;
            hand?: boolean;
        }[] = [];
        checkedCards.forEach(cardData => {
            const { x,y } = cardData;
            const adjacentCards = getAdjacentCards(board,x,y);
            adjacentCards.forEach(adjCardData => {
                if (
                    // If the Adjacent Card has been checked, Skip.
                    !checkedCards.filter(c => c.card.uid === adjCardData.card.uid).length && 
                    // If the Adjacent Card is Connected to the current checked card, add to checked cards
                    cardData.card.sides[adjCardData.dir].connect&&adjCardData.card.sides[dirMap[adjCardData.dir]].connect
                ) {
                    changes.push(adjCardData)
                }
            });
        })
        if (!changes.length) return { success: false, error: "Cards must all be connected", invalidCards };
        checkedCards = [...checkedCards,...changes];
    }
    return { success: isValid, invalidCards };
}

export const addActiveConnections = (cards:CardObjectData[]) => {
    const board = cards.filter(c => !c.hand) as BoardType;
    const updatedCards = cards.map(cardData => {
        const { x,y,hand } = cardData;
        const sides = Object.keys(dirMap);
        if (hand||!x||!y) {
            sides.forEach(side => cardData.card.sides[side].active = false);
            return cardData;
        }
        // Override for Monsters : TODO - add an exception for MELEAGER
        if (cardData.card.type==="monster") {
            sides.forEach(side => cardData.card.sides[side].active = false);
            return cardData;
        }
        const adjacentCards = getAdjacentCards(board,x,y);
        sides.forEach(side => {
            const adjacentCard = adjacentCards.filter(c => c.dir===side)[0];
            cardData.card.sides[side].active = !!(adjacentCard&&adjacentCard.card.sides[dirMap[side]].attribute===cardData.card.sides[side].attribute);
        });
        return cardData;
    })
    return updatedCards;
}

export const validatePlayerData = (Old: PlayerData, New: PlayerData) => {
    // if (Old.player!==New.player) return false;
    let result = true;
    New.cards.forEach(newCardObj => {
        const oldCardObj = Old.cards.filter(oldCardObj => oldCardObj.card.uid===newCardObj.card.uid)[0];
        if (!oldCardObj.card || !deepEqual(oldCardObj.card, newCardObj.card, ["sides.top.active","sides.right.active","sides.left.active","sides.bottom.active"])) {
            console.log(oldCardObj, newCardObj)
            console.log(!oldCardObj.card, !deepEqual(oldCardObj.card, newCardObj.card, ["sides.top.active","sides.right.active","sides.left.active","sides.bottom.active"]))
            result = false;
        } 
    });
    return result;
}


export const validatePayment = (cardToBuy:PopulatedCardData, payment:PopulatedCardData[]) => {
    if (["monster", "god"].includes(cardToBuy.type)) return { success: cardToBuy.cost.length === payment.length, match: cardToBuy.cost.slice(0,payment.length) };
    const paymentCards = payment.map(c => extractCardValue(c));
    const costArray = cardToBuy.cost;
    // Make a copy of paymentCards to track remaining cards.
    const availableCards = [...paymentCards];
    const match: (string | null)[] = [];

  for (const cost of costArray) {
    // Find the first card that can cover the current cost.
    const cardIndex = availableCards.findIndex(card => card.includes(cost));

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

  // Determine success based on whether there are any null values in the match array.
  const success = !match.includes(null);

  return { success, match };
}