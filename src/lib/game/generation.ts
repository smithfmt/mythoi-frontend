import { cards } from "@data/cards";

export const generatePlayerGenerals = (totalPlayers: number) => {
    const generals = cards.general;
    const shuffledGenerals = generals.map(g => g.id).sort(() => 0.5 - Math.random());
    const generalsPerPlayer = Math.min(3, Math.floor(generals.length / totalPlayers));
    const playerGenerals: number[][] = [];
    for (let i=0; i<totalPlayers; i++) {
        playerGenerals.push(shuffledGenerals.splice(0,generalsPerPlayer));
    }
    return playerGenerals;
};