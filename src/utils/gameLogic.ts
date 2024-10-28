import { BoardType, CardObjectData, PopulatedCardData } from "@data/types";


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

export const getPlaceableSpaces = (cards:CardObjectData[], selectedCard:PopulatedCardData) => {
    const board = cards.filter(c => c.x!==undefined&&c.y!==undefined) as BoardType;
    const [[minX, maxX,], [minY, maxY]] = getMinMaxCoordinates(board)
    const result:{x:number,y:number}[] = [];
    for (let x=minX-1;x<maxX+2;x++) {
        for (let y=minY-1;y<maxY+2;y++) {
            const isFilled = !!board.filter(card => card.x===x&&card.y===y).length
            if (!isFilled) {
                const adjacentCards = board.map(card => {
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
                if (adjacentCards.length) {
                    const connectionsMatch = adjacentCards.reduce((prev, cur) => {
                        // If the selected card's connection with the adjacent card matches, pass
                        if (prev && selectedCard.sides[cur.dir].connect===cur.card.sides[dirMap[cur.dir]].connect) return true;
                        return false;
                    }, true);
                    if (connectionsMatch) result.push({x,y})
                }
            }
        }
    }
    
    return result
}