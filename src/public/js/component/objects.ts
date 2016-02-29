import {createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "bomb", src: "https://pbs.twimg.com/media/CSX9aAlUcAAKQwz.png" }
];

export function createBomb(loadQueue: createjs.LoadQueue) {
    return createResizedBitmap(<any>loadQueue.getResult("bomb"));
}
