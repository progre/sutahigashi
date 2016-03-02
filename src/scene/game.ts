import {getLogger} from "log4js";
let logger = getLogger();
import {Game, Bomb, Ball, Point, Land, Overlay} from "../domain/status";
import {createField} from "../domain/game/field";
import Synchronizer from "../infrastructure/synchronizer";
import {Input} from "../domain/input";
import {FPS} from "../domain/gamedefinition";
import * as result from "./result";

const BOMB_DEFAULT_REMAIN = FPS * 3;
export const NAME = "game";
function getDefaultPoint(i: number) {
    return [
        { x: 1, y: 1 },
        { x: 13, y: 11 },
        { x: 13, y: 1 },
        { x: 1, y: 11 }
    ][i];
}

export async function exec(numPlayers: number, synchronizer: Synchronizer) {
    logger.info("Game starting.");
    synchronizer.on("inputs", onInputs);
    let inputsRepository = <Input[][]>[];
    let game = {
        tick: 0,
        players: <Point[]>[],
        bombs: <Bomb[]>[],
        balls: <Ball[]>[],
        lands: createField(),
        overlays: <Overlay[][]>[]
    };
    for (let i = 0; i < 2; i++) {
        game.players.push(getDefaultPoint(i));
    }
    let waiting = 0;
    await new Promise((resolve, reject) => {
        let onUpdateTimer = setInterval(() => {
            let inputs = inputsRepository[game.tick];
            if (inputs == null) {
                waiting++;
                return;
            }
            if (waiting > 0) {
                logger.info(`Game waited caused by late clients: ${waiting} frame(s)`);
                waiting = 0;
            }
            updateGame(game, inputs);
            synchronizer.postScene(NAME, { game });
            if (game.players.filter(x => x.x != null).length <= 1) {
                clearInterval(onUpdateTimer);
                resolve();
            }
        }, 1000 / FPS);
    });
    synchronizer.removeListener("inputs", onInputs);
    logger.info("Game finished.");
    return result;

    function onInputs(inputs: Input[]) {
        inputsRepository.push(inputs);
    }
}

function updateGame(game: Game, inputs: Input[]) {
    inputs.forEach((input, i) => {
        let player = game.players[i];
        if (player.x == null) {
            return;
        }
        movePlayer(input, player, game.lands);
        if (input.bomb) {
            game.bombs.push({ remain: BOMB_DEFAULT_REMAIN, point: { x: player.x, y: player.y } });
        }
        if (game.balls.some(x => player.x === x.point.x && player.y === x.point.y)) {
            player.x = null;
            player.y = null;
        }
    });
    game.bombs = game.bombs.filter(x => x.remain > 0);
    game.bombs.forEach(bomb => {
        bomb.remain--;
        if (bomb.remain > 0) {
            return;
        }
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
    game.balls.forEach(ball => {
        ball.remain--;
        if (ball.remain > 0) {
            return;
        }
        moveBall(ball, game.lands);
        ball.remain = FPS / ball.speed;
    });
    game.balls = game.balls.filter(x => x.point != null);
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
