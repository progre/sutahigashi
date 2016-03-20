import {Game, Ability, Land, Overlay} from "../../../../domain/status";
import {FIELD_WIDTH} from "../../../../domain/game/definition";
import createField, {RESOURCES as fieldResources} from "./field";
import createPlayer, {RESOURCES as playerResources} from "./player";
import * as objects from "./objects";
import {CHIP_PIXEL, FIELD_PIXEL} from "./chip";

const ABILITIES = [Ability.EIGHT_BOMB, Ability.BOMB_UP, Ability.SPEED, Ability.SLOW];

export const RESOURCES = fieldResources
    .concat(playerResources)
    .concat(objects.RESOURCES);

export default class GameViewContainer extends createjs.Container {
    private players: createjs.DisplayObject[];
    private bombs = <createjs.DisplayObject[]>[];
    private balls = <createjs.DisplayObject[]>[];
    private softBlocks = <createjs.DisplayObject[][]>[];
    private items = new Map<Ability, createjs.DisplayObject[]>();

    constructor(
        loader: createjs.AbstractLoader,
        parentRect: { width: number; height: number; },
        lands: Land[]
    ) {
        super();
        let fieldArea = createFieldArea(loader, parentRect, lands);
        this.addChild(fieldArea);

        for (let y = 0; y < 13; y++) {
            let line = <createjs.DisplayObject[]>[];
            for (let x = 0; x < FIELD_WIDTH; x++) {
                let softBlock = objects.createSoftBlock(loader);
                softBlock.visible = false;
                softBlock.x = x * CHIP_PIXEL;
                softBlock.y = y * CHIP_PIXEL;
                line.push(softBlock);
                fieldArea.addChild(softBlock);
            }
            this.softBlocks.push(line);
        }
        for (let ability of ABILITIES) {
            let items = <createjs.DisplayObject[]>[];
            for (let i = 0; i < FIELD_WIDTH * 13; i++) {
                let item = objects.createItem(loader, ability);
                item.visible = false;
                items.push(item);
                fieldArea.addChild(item);
            }
            this.items.set(ability, items);
        }
        this.players = [0, 1, 2, 3].map(x => createPlayer(loader, x));
        this.players.forEach(x => fieldArea.addChild(x));
        for (let i = 0; i < FIELD_WIDTH * 13; i++) {
            let bomb = objects.createBomb(loader);
            bomb.visible = false;
            this.bombs.push(bomb);
            fieldArea.addChild(bomb);
        }
        for (let i = 0; i < FIELD_WIDTH * 13 * 8; i++) {
            let ball = objects.createBall(loader);
            ball.visible = false;
            this.balls.push(ball);
            fieldArea.addChild(ball);
        }
    }

    render(game: Game) {
        game.overlays.forEach((overlay, i) => {
            let x = i % FIELD_WIDTH;
            let y = Math.floor(i / FIELD_WIDTH);
            this.softBlocks[y][x].visible = overlay === Overlay.SOFT_BLOCK;
        });
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
            let itemView = this.items.get(item.ability)[i];
            itemView.visible = true;
            itemView.x = item.point.x * CHIP_PIXEL;
            itemView.y = item.point.y * CHIP_PIXEL;
        });
    }
}

function createFieldArea(
    loader: createjs.AbstractLoader,
    parentRect: { width: number; height: number; },
    lands: Land[]
) {
    let fieldArea = new createjs.Container();
    centering(fieldArea, parentRect, FIELD_PIXEL);
    fieldArea.addChild(createField(loader, lands));
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
