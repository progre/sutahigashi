import {createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "p1", src: "https://pbs.twimg.com/media/CSX967rUYAAMQww.png" },
    { id: "p2", src: "https://pbs.twimg.com/media/CSX_bQQVAAE8GDs.png" },
    { id: "p3", src: "https://pbs.twimg.com/media/CSX-kMzUAAEZ1f9.png" },
    { id: "p4", src: "https://pbs.twimg.com/media/CSX-VzQUkAAj6a9.png" }
];

export default function createPlayer(loader: createjs.AbstractLoader, player: number) {
    let displayObject = createResizedBitmap(<any>loader.getResult(`p${player + 1}`));
    displayObject.visible = false;
    return displayObject;
}
