import * as seedrandom from "seedrandom";
const rnd = seedrandom("remilia");
import * as status from "../status";
import {FPS} from "./definition";
import {createField} from "./field";
import {Input} from "./input";
import * as util from "./util";
import * as objects from "./objects";

export function createStatus(players: string[]) {
    let status = {
        tick: 0,
        players: players.map((x, i) => ({ name: x, point: getDefaultPoint(i) })),
        items: <status.Item[]>[],
        bombs: <status.Bomb[]>[],
        balls: <status.Ball[]>[],
        lands: createField(),
        overlays: <status.Overlay[][]>[]
    };
    return status;
}

function getDefaultPoint(i: number) {
    return [
        { x: 1, y: 1 },
        { x: 13, y: 11 },
        { x: 13, y: 1 },
        { x: 1, y: 11 }
    ][i];
}

export function update(game: status.Game, inputs: Input[]) {
    objects.movePlayers(game.players, game.lands, game.bombs, inputs);
    let actives = cleanup(game.players);
    burn(game.balls, actives, game.items);
    game.balls = cleanup(game.balls);
    actives = cleanup(game.players);
    game.items = cleanup(game.items);
    pickup(actives, game.items);
    game.items = cleanup(game.items);
    objects.moveBalls(game.balls, game.lands);
    game.balls = cleanup(game.balls);
    moveBombs(game.bombs, game.balls); // 誘爆させたボムをすぐに弾にするのでボムは後
    game.bombs = game.bombs.filter(x => x.remain > 0);
    if (rnd() < 0.01) {
        let lands = util.findFreeArea(game);
        let target = Math.floor(lands.length * rnd());
        if (target === lands.length) {
            target = 0;
        }
        game.items.push({ point: lands[target] });
    }
    game.tick++;
    if (game.items.some(item => item.point == null)) { console.log(game.items); throw new Error(); }
}

function burn(balls: status.Ball[], actives: status.Player[], items: status.Item[]) {
    balls.forEach(ball => {
        for (let item of items) {
            if (objects.ballTouchedToItem(ball, item)) {
                item.point = null;
                ball.point = null;
                items = cleanup(items);
                return;
            }
        }
        for (let player of actives) {
            if (objects.ballTouchedToPlayer(ball, player)) {
                player.point = null;
                ball.point = null;
                actives = cleanup(actives);
                return;
            }
        }
    });
}

function pickup(actives: status.Player[], items: status.Item[]) {
    actives.forEach(player => {
        items.forEach(item => {
            if (!objects.playerTouchedToItem(player, item)) {
                return;
            }
            item.point = null;
            console.log("pickup");
            // TODO: アイテムの効果を与える
        });
        items = cleanup(items);
    });
}

function moveBombs(bombs: status.Bomb[], balls: status.Ball[]) {
    bombs
        .forEach(bomb => {
            bomb.remain--;
        });
    bombs
        .filter(bomb => bomb.remain <= 0
            || balls.some(ball => objects.ballTouchedToBomb(ball, bomb)))
        .forEach(bomb => {
            bomb.remain = 0;
            let speed = 4;
            balls.push(
                {
                    speed,
                    remain: FPS / speed,
                    direction: 8,
                    point: { x: bomb.point.x, y: bomb.point.y }
                },
                {
                    speed,
                    remain: FPS / speed,
                    direction: 6,
                    point: { x: bomb.point.x, y: bomb.point.y }
                },
                {
                    speed,
                    remain: FPS / speed,
                    direction: 2,
                    point: { x: bomb.point.x, y: bomb.point.y }
                },
                {
                    speed,
                    remain: FPS / speed,
                    direction: 4,
                    point: { x: bomb.point.x, y: bomb.point.y }
                }
            );
        });
}

function cleanup<T extends { point: status.Point }>(objects: T[]) {
    return objects.filter(x => x.point != null);
}
