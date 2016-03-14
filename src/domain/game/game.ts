import * as seedrandom from "seedrandom";
const rnd = seedrandom("remilia");
import * as status from "../status";
import {FPS} from "./definition";
import {createField} from "./field";
import {Input} from "./input";
import * as util from "./util";

const BOMB_DEFAULT_REMAIN = FPS * 3;

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
    movePlayers(game.players, game.lands, game.bombs, inputs);
    let actives = cleanup(game.players);
    touchTo(actives, game.balls, game.items);
    game.items = cleanup(game.items);
    moveBalls(game.balls, game.lands);
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
}

function movePlayers(players: status.Player[], lands: status.Land[][], bombs: status.Bomb[], inputs: Input[]) {
    inputs.forEach((input, i) => {
        let player = players[i];
        if (player.point == null) {
            return;
        }
        movePlayer(input, player.point, lands);
        if (input.bomb) {
            bombs.push({ remain: BOMB_DEFAULT_REMAIN, point: { x: player.point.x, y: player.point.y } });
        }
        if (input.suicide) {
            player.point = null;
        }
    });
}

function movePlayer(input: Input, player: status.Point, lands: status.Land[][]) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    movePlayerPoint(player, x, y, lands);
}

function touchTo(actives: status.Player[], balls: status.Ball[], items: status.Item[]) {
    actives.forEach(player => {
        if (balls.some(ball => objectTouched(ball, player.point))) {
            player.point = null;
        }
        items.forEach(item => {
            if (item.point == null) { console.log(items); }
            if (!objectTouched(item, player.point)) {
                return;
            }
            item.point = null;
            console.log("pickup");
            // TODO: アイテムの効果を与える
        });
        items = cleanup(items);
    });
}

function moveBalls(balls: status.Ball[], lands: status.Land[][]) {
    balls
        .forEach(ball => {
            ball.remain--;
        });
    balls
        .filter(ball => ball.remain <= 0)
        .forEach(ball => {
            moveBall(ball, lands);
            ball.remain = FPS / ball.speed;
        });
}

function moveBall(ball: status.Ball, lands: status.Land[][]) {
    let x = 0;
    let y = 0;
    switch (ball.direction) {
        case 8: y = -1; break;
        case 6: x = 1; break;
        case 2: y = 1; break;
        case 4: x = -1; break;
        default: throw new Error();
    }
    let {x: oldX, y: oldY} = ball.point;
    movePlayerPoint(ball.point, x, y, lands);
    if (ball.point.x === oldX && ball.point.y === oldY) {
        ball.point = null;
    }
}

function moveBombs(bombs: status.Bomb[], balls: status.Ball[]) {
    bombs
        .forEach(bomb => {
            bomb.remain--;
        });
    bombs
        .filter(bomb => bomb.remain <= 0
            || balls.some(ball => objectTouched(ball, bomb.point)))
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

function movePlayerPoint(point: status.Point, x: number, y: number, lands: status.Land[][]) {
    const width = lands[0].length;
    const height = lands.length;

    let targetX = point.x + x;
    let targetY = point.y + y;
    if (targetX < 0) {
        targetX = 0;
    } else if (targetX >= width) {
        targetX = width - 1;
    }
    if (targetY < 0) {
        targetY = 0;
    } else if (targetY >= height) {
        targetY = height - 1;
    }
    if (lands[targetY][targetX] === status.Land.HARDBLOCK) {
        return;
    }
    point.x = targetX;
    point.y = targetY;
}

function objectTouched(obj: status.Ball | status.Item, target: status.Point) {
    return target.x === obj.point.x && target.y === obj.point.y;
}

function cleanup<T extends { point: status.Point }>(objects: T[]) {
    return objects.filter(x => x.point != null);
}
