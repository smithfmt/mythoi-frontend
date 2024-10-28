export type CardType = {
    id: number,
    type: "basic" | "general" | "hero" 
}

export interface PlayerData {
    player: number;
    cards: CardObjectData[];
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

export interface CardObjectData {
    card: PopulatedCardData,
    x?: number,
    y?: number,
    hand?: boolean
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

export type Attribute = "Str" | "Int" | "Agi" | "Mon" | "Div" | "blank";

export type PopulatedCardData = {
    id: number;
    uid: string;
    img: string;
    name: string;
    atk: number;
    hp: number;
    sides: {
        top: {
            connect: boolean;
            attribute: Attribute;
        };
        right: {
            connect: boolean;
            attribute: Attribute;
        };
        bottom: {
            connect: boolean;
            attribute: Attribute;
        };
        left: {
            connect: boolean;
            attribute: Attribute;
        };
    };
    type: string;
    ability: string;
    style: string;
    cost: Attribute[];
    desc: string;
}

export type BoardType = {
    card:PopulatedCardData,
    x:number,
    y:number,
    hand?:boolean,
}[]