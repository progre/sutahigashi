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
    players: Point[];
    bombs: Point[];
}

export interface Point {
    x: number;
    y: number;
}
