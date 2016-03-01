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
    bombs: Bomb[];
    balls: Ball[];
    lands: Land[][];
    overlays: Overlay[][];
}

export interface Bomb {
    remain: number;
    point: Point;
}

export interface Ball {
    speed: number;
    remain: number;
    direction: number;
    point: Point;
}

export interface Point {
    x: number;
    y: number;
}

export enum Land {
    NONE, HARDBLOCK
}

export enum Overlay {
    NONE, SOFTBLOCK/*, BOMB*/
}
