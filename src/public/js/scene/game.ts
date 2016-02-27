import {Status} from "../../../domain/status";
import createField, {RESOURCES as fieldResources} from "../component/field";
import createPlayer, {RESOURCES as playerResources} from "../component/player";
import createScene from "./scenefactory";
import {FIELD_PIXEL} from "../component/chip";

export const RESOURCES = fieldResources.concat(playerResources);

export default async function game(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Game starting.");
    let game = new createjs.Container();
    stage.addChild(game);
    let canvas = <HTMLCanvasElement>stage.canvas;
    let fieldArea = new createjs.Container();
    centering(fieldArea, canvas, FIELD_PIXEL);
    game.addChild(fieldArea);
    fieldArea.addChild(createField(loadQueue));
    fieldArea.addChild(createPlayer(loadQueue, 0));
    stage.update();
    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "game") {
                return;
            }
            socket.off("status", onSocketStatus);
            resolve(createScene(status.scene));
        });
    });
    stage.removeChild(game);
    stage.update();
    console.log("Game finished.");
    return scene;
}

function centering(
    child: createjs.DisplayObject,
    parentRect: { width: number; height: number; },
    childRect: { width: number; height: number; }
) {
    child.x = (parentRect.width - childRect.width) / 2;
    child.y = (parentRect.height - childRect.height) / 2;
}
