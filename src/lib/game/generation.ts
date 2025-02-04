import { cards } from "@data/cards";
import { BattleData, GameData } from "@data/types";
import { shuffle } from "@utils/helpers";

export const generatePlayerGenerals = (totalPlayers: number) : number[][] => {
    const generals = cards.general;
    const shuffledGenerals = generals.map(g => g.id).sort(() => 0.5 - Math.random());
    const generalsPerPlayer = Math.min(3, Math.floor(generals.length / totalPlayers));
    const playerGenerals: number[][] = [];
    for (let i=0; i<totalPlayers; i++) {
        playerGenerals.push(shuffledGenerals.splice(0,generalsPerPlayer));
    }
    return playerGenerals;
};

export const generateBattleOrder = (count: number, distribution: number): number[] => {
    const battleOrder: number[] = [];
    for (let i = 0; i < count; i++) {
      const randomOffset = Math.floor(Math.random() * 3);
      const sign = Math.random() < 0.5 ? -1 : 1;
      battleOrder.push(i * distribution + sign * randomOffset);
    }
    return battleOrder;
};

export const generateBattle = (game:GameData, players: number[]) : BattleData => {
    const battlePlayers = game.players.filter(p => players.includes(p.id)).map(p => ({...p, gameData: JSON.parse(p.gameData as string) as GameData}));
    // TODO Sort out bots
    return {
        players: battlePlayers,
        graveyard: [],
        ended: false,
        turnOrder: shuffle(players),
        turn: 1,
    };
};