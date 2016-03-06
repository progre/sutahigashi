import {Status, Game} from "../../../domain/status";
import {FPS} from "../../../domain/game/definition";
import createField, {RESOURCES as fieldResources} from "../component/field";
import createPlayer, {RESOURCES as playerResources} from "../component/player";
import {createBomb, createBall, RESOURCES as objectsResources} from "../component/objects";
import createScene from "./scenefactory";
import {CHIP_PIXEL, FIELD_PIXEL} from "../component/chip";
import Controller from "../infrastructure/controller";

export const RESOURCES = fieldResources
    .concat(playerResources)
    .concat(objectsResources);

export default async function game(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Game starting.");

    let controller = new Controller();
    let container = new GameViewContainer(loadQueue, <HTMLCanvasElement>stage.canvas);
    stage.addChild(container);
    stage.update();

    const wait = 10;
    let tick = 0;
    let sendingTick = 0;
    let waiting = 0;
    let onUpdateTimer = setInterval(() => {
        if (sendingTick > tick + wait) {
            // 入力が先行しすぎないようにする
            waiting++;
            return;
        }
        if (waiting > 0) {
            console.log(`Input waited caused by server lated: ${waiting} frame(s)`);
            waiting = 0;
        }
        socket.emit("input", controller.popStatus());
        sendingTick++;
    }, 1000 / FPS);

    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "game") {
                tick = status.game.tick;
                render(container, status.game);
                stage.update();
                return;
            }
            socket.off("status", onSocketStatus);
            resolve(createScene(status.scene));
        });
    });
    clearInterval(onUpdateTimer);
    stage.removeChild(container);
    stage.update();
    controller.release();
    console.log("Game finished.");
    return scene;
}

class GameViewContainer extends createjs.Container {
    players: createjs.DisplayObject[];
    bombs: createjs.DisplayObject[];
    balls: createjs.DisplayObject[];

    constructor(loadQueue: createjs.LoadQueue, parentRect: { width: number; height: number; }) {
        super();
        let fieldArea = createFieldArea(loadQueue, parentRect);
        this.addChild(fieldArea);

        this.players = [0, 1, 2, 3].map(x => createPlayer(loadQueue, x));
        this.players.forEach(x => fieldArea.addChild(x));
        this.bombs = [];
        for (let i = 0; i < 15 * 13; i++) {
            let bomb = createBomb(loadQueue);
            bomb.visible = false;
            this.bombs.push(bomb);
            fieldArea.addChild(bomb);
        }
        this.balls = [];
        for (let i = 0; i < 15 * 13 * 8; i++) {
            let ball = createBall(loadQueue);
            ball.visible = false;
            this.balls.push(ball);
            fieldArea.addChild(ball);
        }
    }
}

function render(container: GameViewContainer, game: Game) {
    game.players.forEach((player, i) => {
        if (player.x == null) {
            container.players[i].visible = false;
            return;
        }
        container.players[i].visible = true;
        container.players[i].x = player.x * CHIP_PIXEL;
        container.players[i].y = player.y * CHIP_PIXEL;
    });
    container.bombs.forEach((bombView, i) => {
        if (i >= game.bombs.length) {
            bombView.visible = false;
            return;
        }
        bombView.visible = true;
        bombView.x = game.bombs[i].point.x * CHIP_PIXEL;
        bombView.y = game.bombs[i].point.y * CHIP_PIXEL;
    });
    container.balls.forEach((ballView, i) => {
        if (i >= game.balls.length) {
            ballView.visible = false;
            return;
        }
        ballView.visible = true;
        ballView.x = game.balls[i].point.x * CHIP_PIXEL;
        ballView.y = game.balls[i].point.y * CHIP_PIXEL;
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
