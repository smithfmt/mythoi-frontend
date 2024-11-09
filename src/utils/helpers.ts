/* eslint-disable @typescript-eslint/no-explicit-any */
export const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shuffle(array:any[]) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function findIndexByParam (array:any[], key:string[], param:any) {
    let index:number | undefined;
    
    switch (key.length) {
        case 1:
            array.forEach((item,i) => item[key[0]]===param && (index = i));
            break;
        case 2:
            array.forEach((item,i) => item[key[0]][key[1]]===param && (index = i));
            break;
        case 3:
            array.forEach((item,i) => item[key[0]][key[1]][key[2]]===param && (index = i));
            break;
        default:
            break;
    }
    
    return index;
};