export type CardType = {
    id: number,
    type: "basic" | "general" | "hero" 
}

export interface PlayerData {
    player: number;
    board: {
        card: CardType,
        x: number,
        y: number,
    }[];
    hand: CardType[],
    generals: {
        selected: boolean,
        choices: number[],
    },
    basicCount: number;
}

export interface GameData {
    name: string;
    players: { id: number, name: string }[];
    host: string;
    turn: string;
    drawnHeroes: string[];
    playerData: string;
}

export interface CardData {
    id: number,
    img: string,
    name: string,
    atk: number,
    hp: number,
    connect: number,
    red: number,
    green: number,
    blue: number,
    type: string,
    ability: string,
    style: string,
    cost: number,
    desc: string,
}