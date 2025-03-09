import { JsonValue } from "@prisma/client/runtime/library";
import { cards } from "./cards"

export type CardType = {
    id: number,
    type: keyof typeof cards,
}

export type GeneralsType = {
    selected: boolean,
    choices: PopulatedCardData[] | number[],
}

export type RawCardData = {
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
  
export type RawCardsObject = {
    [key in 'basic' | 'general' | 'hero']: RawCardData[];
};

export type Attribute = "Str" | "Int" | "Agi" | "Mon" | "Div";

export type ActionType = "attack" | "cast";

export const sides = ["top", "right", "bottom", "left"];

type Connection = {
    connect: boolean;
    attribute: Attribute;
    active?: boolean;
};

export interface CardData {
    uid: string;
    img: string;
    name: string;
    atk: number;
    hp: number;
    top: JsonValue;
    right: JsonValue;
    bottom: JsonValue;
    left: JsonValue;
    type: string;
    ability: string;
    style: string;
    cost: Attribute[];
    desc: string;
    x?: number;
    y?: number;
    inHand: boolean;
    playerId?: number;
    player?: PlayerData;
    inDiscardPile: boolean;
    inHeroShop?: boolean;
    isGeneralSelection?: boolean;
    battleCard?: BattleCardData[];
    gameId: number;
}

export interface PopulatedCardData extends CardData {
    id: number;
    top: Connection;
    right: Connection;
    bottom: Connection;
    left: Connection;
}

export interface BattleCardData extends CardData {
    id: number;
    hasCast: boolean;
    currentAtk: number;
    currentHp: number;
    gameCardId: number;
    gameCard?: CardData;
    inGraveyard: boolean;
}

export interface PopulatedBattleCardData extends BattleCardData {
    top: Connection;
    right: Connection;
    bottom: Connection;
    left: Connection;
}

export interface UserData {
    id: number;
    name: string;
    createdAt?: Date;
    lobbyId?: number;
    lobby?: LobbyData;
    player?: PlayerData;
}

export interface PlayerData {
    id: number;
    userId: number;
    user: UserData;
    gameId: number;
    game: GameData
    cards: PopulatedCardData[];
    battles: BattleData[];
    battleCards: BattleCardData[];
    generalSelected: boolean;
    turnEnded: boolean;
}

export interface LobbyData {
    id: number;
    name: string;
    createdAt?: Date;
    players: UserData[];
    game?: GameData;
    maxPlayers: number;
    hostId: number;
    playerCount: number
}

export interface GameData {
    id: number;
    name: string;
    createdAt?: Date;
    hostId: number;
    turn: number;
    turnOrder: number[];
    heroDeck: number[];
    finished: boolean;
    lobbyId: number;
    lobby: LobbyData;
    battleOrder: number[];
    battles: BattleData[];
    battling: boolean;
    currentBattleId?: number;
    heroShop?: PopulatedCardData[];
    players: PlayerData[];
}

export type BattleData = {
    id: number;
    gameId: number;
    game?: GameData;
    ended: boolean;
    turnOrder: number[];
    turn: number;
}

export type CardQueryCondition = {
    isGeneralSelection?: boolean;
    playerId?: number;
};

export type Space = {
    x: number;
    y: number;
    inHand: boolean;
}