import {Game, Ability} from "../../../../domain/status";
import createField, {RESOURCES as fieldResources} from "./field";
import createPlayer, {RESOURCES as playerResources} from "./player";
import {createBomb, createBall, createItem, RESOURCES as objectsResources} from "./objects";
import {CHIP_PIXEL, FIELD_PIXEL} from "./chip";

const ABILITIES = [Ability.EIGHT_BOMB];

export const RESOURCES = fieldResources
    .concat(playerResources)
    .concat(objectsResources);

export default class GameViewContainer extends createjs.Container {
    players: createjs.DisplayObject[];
    bombs = <createjs.DisplayObject[]>[];
    balls = <createjs.DisplayObject[]>[];
    items = new Map<Ability, createjs.DisplayObject[]>();

    constructor(loader: createjs.AbstractLoader, parentRect: { width: number; height: number; }) {
        super();
        let fieldArea = createFieldArea(loader, parentRect);
        this.addChild(fieldArea);

        this.players = [0, 1, 2, 3].map(x => createPlayer(loader, x));
        this.players.forEach(x => fieldArea.addChild(x));
        for (let i = 0; i < 15 * 13; i++) {
            let bomb = createBomb(loader);
            bomb.visible = false;
            this.bombs.push(bomb);
            fieldArea.addChild(bomb);
        }
        for (let i = 0; i < 15 * 13 * 8; i++) {
            let ball = createBall(loader);
            ball.visible = false;
            this.balls.push(ball);
            fieldArea.addChild(ball);
        }
        for (let ability of ABILITIES) {
            let items = <createjs.DisplayObject[]>[];
            for (let i = 0; i < 15 * 13; i++) {
                let item = createItem(loader, ability);
                item.visible = false;
                items.push(item);
                fieldArea.addChild(item);
            }
            console.log(ability);
            this.items.set(ability, items);
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
        for (let abilityItems of this.items) {
            for (let item of abilityItems[1]) {
                item.visible = false;
            }
        }
        game.items.forEach((item, i) => {
            console.log("server: " + item.ability);
            let itemView = this.items.get(item.ability)[i];
            itemView.visible = true;
            itemView.x = item.point.x * CHIP_PIXEL;
            itemView.y = item.point.y * CHIP_PIXEL;
        });
    }
}

function createFieldArea(
    loader: createjs.AbstractLoader,
    parentRect: { width: number; height: number; }
) {
    let fieldArea = new createjs.Container();
    centering(fieldArea, parentRect, FIELD_PIXEL);
    fieldArea.addChild(createField(loader));
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
