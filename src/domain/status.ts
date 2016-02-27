export interface Status {
    version?: number;
    scene?: string;
    users?: User[];
    game: Game;
}

export interface User {
    name: string;
}

export interface Game {
    tick: number;
    players: Player[];
}

export interface Player {
    x: number;
    y: number;
}
