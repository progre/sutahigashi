import {createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "bomb", src: "https://pbs.twimg.com/media/CSX9aAlUcAAKQwz.png" },
    { id: "ball", src: "https://pbs.twimg.com/media/CSX_TViU8AAc5Sk.png" }
];

export function createBomb(loadQueue: createjs.LoadQueue) {
    return createResizedBitmap(<any>loadQueue.getResult("bomb"));
}

export function createBall(loadQueue: createjs.LoadQueue) {
    return createResizedBitmap(<any>loadQueue.getResult("ball"));
}
