import * as seedrandom from "seedrandom";
const rnd = seedrandom("remilia");
import {Game as GameState, Item, Bomb, Ball, Point, Land, Overlay} from "../status";
import {FPS} from "./definition";
import {createField} from "./field";
import {Input} from "./input";
import * as util from "./util";

const BOMB_DEFAULT_REMAIN = FPS * 3;

export function createStatus(players: string[]) {
    let status = {
        tick: 0,
        players: players.map((x, i) => ({ name: x, point: getDefaultPoint(i) })),
        items: <Item[]>[],
        bombs: <Bomb[]>[],
        balls: <Ball[]>[],
        lands: createField(),
        overlays: <Overlay[][]>[]
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

export function update(game: GameState, inputs: Input[]) {
    inputs.forEach((input, i) => {
        let player = game.players[i];
        if (player.point == null) {
            return;
        }
        movePlayer(input, player.point, game.lands);
        if (input.bomb) {
            game.bombs.push({ remain: BOMB_DEFAULT_REMAIN, point: { x: player.point.x, y: player.point.y } });
        }
        if (input.suicide
            || game.balls.some(x => ballTouched(x, player.point))) {
            player.point = null;
        }
    });
    game.balls
        .forEach(ball => {
            ball.remain--;
        });
    game.balls
        .filter(ball => ball.remain <= 0)
        .forEach(ball => {
            moveBall(ball, game.lands);
            ball.remain = FPS / ball.speed;
        });
    game.balls = game.balls.filter(x => x.point != null);
    // 誘爆させたボムをすぐに弾にするのでボムは後
    game.bombs
        .forEach(bomb => {
            bomb.remain--;
        });
    game.bombs
        .filter(bomb => bomb.remain <= 0
            || game.balls.some(ball => ballTouched(ball, bomb.point)))
        .forEach(bomb => {
            bomb.remain = 0;
            let speed = 4;
            game.balls.push(
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
    game.items.forEach(item => {
        let pickuper = game.players.find(player => util.equals(item.point, player.point));
        if (pickuper != null) {
            item.point = null;
            console.log("pickup");
            // TODO: アイテムの効果を与える
        }
    });
    game.items = game.items.filter(item => item.point != null);
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

function movePlayer(input: Input, player: Point, lands: Land[][]) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    addPoint(player, x, y, lands);
}

function moveBall(ball: Ball, lands: Land[][]) {
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
    addPoint(ball.point, x, y, lands);
    if (ball.point.x === oldX && ball.point.y === oldY) {
        ball.point = null;
    }
}

function addPoint(point: Point, x: number, y: number, lands: Land[][]) {
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
    if (lands[targetY][targetX] === Land.HARDBLOCK) {
        return;
    }
    point.x = targetX;
    point.y = targetY;
}

function ballTouched(ball: Ball, target: Point) {
    return target.x === ball.point.x && target.y === ball.point.y;
}
