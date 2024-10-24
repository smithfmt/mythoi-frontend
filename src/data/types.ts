export interface PlayerData {
    player: number;
    board: {
        card: string,
        x: number,
        y: number,
    }[];
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