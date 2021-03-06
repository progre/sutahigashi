export interface Status {
    version?: number;
    scene?: string;
    lobby?: Lobby;
    game?: Game;
    interval?: Interval;
    result?: Result;
}

export interface Lobby {
    users: User[];
}

export interface Interval {
    users: User[];
    winner: number;
}

export interface Result {
    number: number;
    winner: User;
}

export interface User {
    id: string;
    name: string;
    wins: number;
}

export interface Game {
    tick: number;
    players: Player[];
    items: Item[];
    balls: Ball[];
    lands: Land[];
    overlays: Overlay[];
}

export interface Player {
    id: string;
    name: string;
    point: Point;
    ability: Ability[];
    bombs: Bomb[];
    maxBomb: number;
    direction: number;
    attackWait: number;
}

export enum Ability {
    EIGHT_BOMB,
    BOMB_UP,
    SPEED,
    SLOW,
    HADO_GUN
}

export namespace Ability {
    export const LIST = [
        Ability.EIGHT_BOMB,
        Ability.BOMB_UP,
        Ability.SPEED,
        Ability.SLOW,
        Ability.HADO_GUN
    ];
}

export interface Item {
    point: Point;
    ability: Ability;
}

export interface Bomb {
    remain: number;
    point: Point;
    ability: Ability;
    ballSpeed: number;
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
    NONE, HARD_BLOCK
}

export enum Overlay {
    NONE, SOFT_BLOCK, SUDDEN_DEATH_BLOCK
}
