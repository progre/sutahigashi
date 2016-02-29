import {Status} from "../../../domain/status";
import createField, {RESOURCES as fieldResources} from "../component/field";
import createPlayer, {RESOURCES as playerResources} from "../component/player";
import createScene from "./scenefactory";
import {CHIP_PIXEL, FIELD_PIXEL} from "../component/chip";
import Controller from "../infrastructure/controller";

export const RESOURCES = fieldResources.concat(playerResources);

export default async function game(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Game starting.");

    let controller = new Controller();

    let game = new createjs.Container();
    stage.addChild(game);

    let fieldArea = createFieldArea(loadQueue, <HTMLCanvasElement>stage.canvas);
    game.addChild(fieldArea);

    let players = [0, 1, 2, 3].map(x => createPlayer(loadQueue, x));
    players.forEach(x => fieldArea.addChild(x));

    stage.update();

    let wait = 1;
    let tick = 0;
    let sendingTick = 0;
    let onUpdateTimer = setInterval(() => {
        if (sendingTick < tick - wait) {
            return;
        }
        socket.emit("input", controller.popStatus());
        sendingTick++;
    }, 33);

    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "game") {
                tick = status.game.tick;
                render(players, status);
                stage.update();
                return;
            }
            socket.off("status", onSocketStatus);
            resolve(createScene(status.scene));
        });
    });
    clearInterval(onUpdateTimer);
    stage.removeChild(game);
    stage.update();
    controller.release();
    console.log("Game finished.");
    return scene;
}

function render(players: createjs.Bitmap[], status: Status) {
    status.game.players.forEach((player, i) => {
        players[i].x = player.x * CHIP_PIXEL;
        players[i].y = player.y * CHIP_PIXEL;
    });
}

function createFieldArea(
    loadQueue: createjs.LoadQueue,
    parentRect: { width: number; height: number; }
) {
    let fieldArea = new createjs.Container();
    centering(fieldArea, parentRect, FIELD_PIXEL);
    fieldArea.addChild(createField(loadQueue));
    return fieldArea;
}

function centering(
    child: createjs.DisplayObject,
    parentRect: { width: number; height: number; },
    childRect: { width: number; height: number; }
) {
    child.x = (parentRect.width - childRect.width) / 2;
    child.y = (parentRect.height - childRect.height) / 2;
}
