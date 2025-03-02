/* eslint-disable @typescript-eslint/no-explicit-any */

import { Attribute, PopulatedBattleCardData, PopulatedCardData, RawCardData, sides } from "@data/types";
import { Prisma } from "@prisma/client";
import { shuffle } from "@utils/helpers";
import { v4 as uuidv4 } from 'uuid';

export const fillConnections = (array:any[]) => {
    while (array.length<4) {
        array.push("blank");
    }
    return array;
};

export const fillBlankAttribute = (index:number, costs:any[]) => {
    let res:Attribute;
    const clockwise = Math.random()>0.5;
    switch (index) {
        case 0:
            res = clockwise ? 
                costs[1] !== "blank" ? costs[1] : costs[3] !== "blank" ? costs[3] : costs[2]:
                costs[3] !== "blank" ? costs[3] : costs[1] !== "blank" ? costs[1] : costs[2];
            break;
        case 1:
            res = clockwise ? 
                costs[2] !== "blank" ? costs[2] : costs[0] !== "blank" ? costs[0] : costs[3]:
                costs[0] !== "blank" ? costs[0] : costs[2] !== "blank" ? costs[2] : costs[3];
            break;
        case 2:
            res = clockwise ? 
                costs[3] !== "blank" ? costs[3] : costs[1] !== "blank" ? costs[1] : costs[0]:
                costs[1] !== "blank" ? costs[1] : costs[3] !== "blank" ? costs[3] : costs[0];
            break;
        default:
            res = clockwise ? 
                costs[0] !== "blank" ? costs[0] : costs[2] !== "blank" ? costs[2] : costs[1]:
                costs[2] !== "blank" ? costs[2] : costs[0] !== "blank" ? costs[0] : costs[1];
            break;
    }
    return res;
};

export const generateCard = (card:RawCardData) => {
    const { img, name, atk, hp, red=0, green=0, blue=0, mon=0, div=0, ability, style, cost, desc, type } = card;
    
    const attributes:Attribute[] = [];

    for (let i=0;i<red;i++) {
        attributes.push("Str");
    }
    for (let i=0;i<green;i++) {
        attributes.push("Agi");
    }
    for (let i=0;i<blue;i++) {
        attributes.push("Int");
    }
    for (let i=0;i<mon;i++) {
        attributes.push("Mon");
    }
    for (let i=0;i<div;i++) {
        attributes.push("Div");
    }
    
    const shuffledAttributes = shuffle(attributes);
    const costs:Attribute[] = shuffledAttributes.slice(0,cost);
    const connections = shuffledAttributes.length>4?shuffledAttributes.slice(0,4):shuffledAttributes.length<4? shuffle(fillConnections(shuffledAttributes)): shuffledAttributes
    const top = {
        connect: connections[0]!=="blank",
        attribute: connections[0]!=="blank"?connections[0]:fillBlankAttribute(0,shuffledAttributes),
        active:false,
    };
    const right = {
        connect: connections[1]!=="blank",
        attribute: connections[1]!=="blank"?connections[1]:fillBlankAttribute(1,shuffledAttributes),
        active:false,
    };
    const bottom = {
        connect: connections[2]!=="blank",
        attribute: connections[2]!=="blank"?connections[2]:fillBlankAttribute(2,shuffledAttributes),
        active:false,
    };
    const left = {
        connect: connections[3]!=="blank",
        attribute: connections[3]!=="blank"?connections[3]:fillBlankAttribute(3,shuffledAttributes),
        active:false,
    }

    const image = type==="basic" ? img[Math.floor(Math.random()*img.length)]: img as string;

    const populatedCard = {
        uid: uuidv4(), img: image, name, atk, hp, ability, style, desc, type,
        top, right, bottom, left, cost: costs,
        inHand: false, inDiscardPile: false,
    };
    return populatedCard;
};

export const extractCardValue = (card: PopulatedCardData) => {
    const result:Attribute[] = [];
    sides.forEach(side => {
        if (!result.includes(card[side].attribute)) result.push(card[side].attribute);
    });
    return result;
};

export const calcConnectedStats = (card?: PopulatedBattleCardData) => {
    if (!card) return { newAtk: undefined, newHp: undefined };
    let [newAtk, newHp] = [card.atk, card.hp];
    sides.forEach(side => {
        if (card[side].active) {
            switch (card[side].attribute) {
                case "Agi":
                    newHp++;
                    break;
                case "Str":
                    newAtk++;
                    break;
                case "Int":
                    newAtk++;
                    newHp++;
                    break;
                case "Div":
                    newAtk++;
                    newHp++;
                    break;
                case "Mon":
                    break;
            }
        }
    });
    return { newAtk, newHp };
}

export const cleanCardForDB = (card: PopulatedCardData) => {
    return {
        ...card,
        top: card.top ?? Prisma.JsonNull,
        right: card.right ?? Prisma.JsonNull,
        bottom: card.bottom ?? Prisma.JsonNull,
        left: card.left ?? Prisma.JsonNull,
    };
}