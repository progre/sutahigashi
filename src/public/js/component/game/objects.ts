import {createResizedBitmap} from "./chip";
import {Ability} from "../../../../domain/status";

export const RESOURCES = [
    { id: "bomb", src: "https://pbs.twimg.com/media/CSX9aAlUcAAKQwz.png" },
    { id: "ball", src: "https://pbs.twimg.com/media/CSX_TViU8AAc5Sk.png" },
    { id: "item_" + Ability.EIGHT_BOMB, src: "https://pbs.twimg.com/media/CSX_XL3UwAAJv-E.png" }
];

export function createBomb(loader: createjs.AbstractLoader) {
    return createResizedBitmap(<any>loader.getResult("bomb"));
}

export function createBall(loader: createjs.AbstractLoader) {
    return createResizedBitmap(<any>loader.getResult("ball"));
}

export function createItem(loader: createjs.AbstractLoader, ability: Ability) {
    return createResizedBitmap(<any>loader.getResult("item_" + ability));
}
