import {createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "bomb", src: "https://pbs.twimg.com/media/CSX9aAlUcAAKQwz.png" },
    { id: "ball", src: "https://pbs.twimg.com/media/CSX_TViU8AAc5Sk.png" }
];

export function createBomb(loader: createjs.AbstractLoader) {
    return createResizedBitmap(<any>loader.getResult("bomb"));
}

export function createBall(loader: createjs.AbstractLoader) {
    return createResizedBitmap(<any>loader.getResult("ball"));
}
