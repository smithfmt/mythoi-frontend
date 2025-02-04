import { JsonValue } from "@prisma/client/runtime/library";
import { cards } from "./cards"

export type CardType = {
    id: number,
    type: keyof typeof cards,
}

export interface PlayerData {
    player: number;
    cards: {
        card: PopulatedCardData,
        x?: number,
        y?: number,
        hand?: boolean,
    }[];
    generals: GeneralsType;
    turnEnded: boolean;
}

export type GeneralsType = {
    selected: boolean,
    choices: PopulatedCardData[] | number[],
}

export type CardData = {
    id: number;
    img: string | string[];
    name: string;
    atk: number;
    hp: number;
    connect: number;
    red?: number;
    green?: number;
    blue?: number;
    mon?: number;
    div?: number;
    type: string;
    ability: string;
    style: string;
    cost: number;
    desc: string;
    weight?: number;
};
  
export type CardsObject = {
    [key in 'basic' | 'general' | 'hero']: CardData[];
};

export type Attribute = "Str" | "Int" | "Agi" | "Mon" | "Div";

type Connection = {
    connect: boolean;
    attribute: Attribute;
    active?: boolean;
}

export type PopulatedCardData = {
    id: number;
    uid: string;
    img: string;
    name: string;
    atk: number;
    hp: number;
    sides: {
        top: Connection;
        right: Connection;
        bottom: Connection;
        left: Connection;
    };
    type: string;
    ability: string;
    style: string;
    cost: Attribute[];
    desc: string;
}

export interface GameData {
    id: number;
    name: string;
    players: { id: number, name: string, gameData: JsonValue }[];
    host: string;
    turn: number;
    heroDeck: number[];
    heroShop: JsonValue;
    turnOrder: number[];
    discardPile: JsonValue;
    battleOrder: number[];
    battles: JsonValue[];
    battling: boolean;
}

export type BattleData = {
    players: {
        gameData: GameData;
        id: number;
        name: string;
    }[];
    graveyard: { card:CardData, playerId: number}[];
    ended: boolean;
    turnOrder: number[];
    turn: number;
}

export type Space = {
    x?: number;
    y?: number;
    hand?: boolean;
}

export interface CardObjectData extends Space {
    card: PopulatedCardData;
}

export type BoardType = {
    card:PopulatedCardData,
    x:number,
    y:number,
    hand?:boolean,
}[]

export type UserDataType = {
    name: string;
    id: number;
    gameData: string;
}
