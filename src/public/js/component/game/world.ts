import {Game} from "../../../../domain/status";
import createField, {RESOURCES as fieldResources} from "./field";
import createPlayer, {RESOURCES as playerResources} from "./player";
import {createBomb, createBall, RESOURCES as objectsResources} from "./objects";
import {CHIP_PIXEL, FIELD_PIXEL} from "./chip";

export const RESOURCES = fieldResources
    .concat(playerResources)
    .concat(objectsResources);

export default class GameViewContainer extends createjs.Container {
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

    render(game: Game) {
        game.players.forEach((player, i) => {
            if (player.point == null) {
                this.players[i].visible = false;
                return;
            }
            this.players[i].visible = true;
            this.players[i].x = player.point.x * CHIP_PIXEL;
            this.players[i].y = player.point.y * CHIP_PIXEL;
        });
        this.bombs.forEach((bombView, i) => {
            if (i >= game.bombs.length) {
                bombView.visible = false;
                return;
            }
            bombView.visible = true;
            bombView.x = game.bombs[i].point.x * CHIP_PIXEL;
            bombView.y = game.bombs[i].point.y * CHIP_PIXEL;
        });
        this.balls.forEach((ballView, i) => {
            if (i >= game.balls.length) {
                ballView.visible = false;
                return;
            }
            ballView.visible = true;
            ballView.x = game.balls[i].point.x * CHIP_PIXEL;
            ballView.y = game.balls[i].point.y * CHIP_PIXEL;
        });
    }
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