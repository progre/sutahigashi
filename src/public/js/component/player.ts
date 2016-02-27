import {CHIP_PIXEL, createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "p1", src: "res/p1.png" },
    { id: "p2", src: "res/p2.png" },
    { id: "p3", src: "res/p3.png" },
    { id: "p4", src: "res/p4.png" }
];

export default function createPlayer(loadQueue: createjs.LoadQueue, player: number) {
    return createResizedBitmap(<any>loadQueue.getResult(`p${player + 1}`));
}
