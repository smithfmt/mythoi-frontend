/* eslint-disable @typescript-eslint/no-explicit-any */

import { Attribute, CardData, PopulatedCardData } from "@data/types";
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

export const generateCard = (card:CardData) => {
    const { id, img, name, atk, hp, red, green, blue, ability, style, cost, desc, type } = card;
    
    const attributes:Attribute[] = [];
    switch (type) {
        case "monster":
            for (let i=0;i<4;i++) {
                attributes.push("Div");
            }
            break;
        case "god":
            for (let i=0;i<5;i++) {
                attributes.push("Div");
            }
            break;
        default:
            for (let i=0;i<red;i++) {
                attributes.push("Str");
            }
            for (let i=0;i<green;i++) {
                attributes.push("Agi");
            }
            for (let i=0;i<blue;i++) {
                attributes.push("Int");
            }
            break;
    };
    const shuffledAttributes = shuffle(attributes);
    const costs:Attribute[] = shuffledAttributes.slice(0,cost);
    const connections = shuffledAttributes.length>4?shuffledAttributes.slice(0,4):shuffledAttributes.length<4? shuffle(fillConnections(shuffledAttributes)): shuffledAttributes
    const sides = {
        top: {
            connect: connections[0]!=="blank",
            attribute: connections[0]!=="blank"?connections[0]:fillBlankAttribute(0,shuffledAttributes),
        },
        right: {
            connect: connections[1]!=="blank",
            attribute: connections[1]!=="blank"?connections[1]:fillBlankAttribute(1,shuffledAttributes),
        },
        bottom: {
            connect: connections[2]!=="blank",
            attribute: connections[2]!=="blank"?connections[2]:fillBlankAttribute(2,shuffledAttributes),
        },
        left: {
            connect: connections[3]!=="blank",
            attribute: connections[3]!=="blank"?connections[3]:fillBlankAttribute(3,shuffledAttributes),
        }
    };

    const image = type==="basic" ? img[Math.floor(Math.random()*img.length)]: img as string;

    const populatedCard: PopulatedCardData = {
        id, uid: uuidv4(),img:image, name, atk, hp, ability, style, desc, type,
        sides, cost: costs,
    };
    return populatedCard;
};

