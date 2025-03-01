/* eslint-disable @typescript-eslint/no-explicit-any */
export const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shuffle<T>(array:T[]) {
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

export function deepEqual(obj1, obj2, ignorePaths:string[] = []) {
    // Helper function to check if a property path should be ignored
    const shouldIgnore = (path) => ignorePaths.includes(path.join("."));

    // Inner recursive function that keeps track of the current path
    function compare(obj1, obj2, path:string[] = []) {
        // Check if both are the same reference (quick exit)
        if (obj1 === obj2) return true;

        // Check if both are objects, otherwise they’re not equal
        if (typeof obj1 !== 'object' || obj1 === null ||
            typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }

        // Get keys for both objects
        const keys1 = Object.keys(obj1);

        // Check each key in obj1 to make sure it’s in obj2 with the same value
        for (const key of keys1) {
            const currentPath = [...path, key];

            // Skip if this key path is in the ignore list
            if (shouldIgnore(currentPath)) continue;

            // Check that obj2 has the same key and recursively compare values
            if (!obj2.hasOwnProperty(key) || !compare(obj1[key], obj2[key], currentPath)) {
                return false;
            }
        }

        // If no mismatches found, the objects are equal
        return true;
    }

    return compare(obj1, obj2);
}

export function rotateArray<T>(arr: T[]): T[] {
    if (arr.length === 0) return arr; // Handle empty array
    const [first, ...rest] = arr; // Destructure the array
    return [...rest, first];      // Reconstruct with first at the end
}