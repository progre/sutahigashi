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

export async function exec(synchronizer: Synchronizer) {
    logger.info("Game starting.");
    synchronizer.on("inputs", onInputs);
    let inputsRepository = <Input[][]>[];
    let game = {
        tick: 0,
        players: [
            { x: 1, y: 1 },
            { x: 13, y: 11 },
            { x: 13, y: 1 },
            { x: 1, y: 11 }
        ],
        bombs: <Bomb[]>[],
        balls: <Ball[]>[],
        lands: createField(),
        overlays: <Overlay[][]>[]
    };
    let waiting = 0;
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
    }, 1000 / FPS);
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10 * 1000);
    });

    synchronizer.removeListener("inputs", onInputs);
    clearInterval(onUpdateTimer);
    logger.info("Game finished.");
    return result;

    function onInputs(inputs: Input[]) {
        inputsRepository.push(inputs);
    }
}

function updateGame(game: Game, inputs: Input[]) {
    inputs.forEach((input, i) => {
        let player = game.players[i];
        move(input, player, game.lands);
        if (input.bomb) {
            game.bombs.push({ remain: BOMB_DEFAULT_REMAIN, point: { x: player.x, y: player.y } });
        }
    });
    game.bombs = game.bombs.filter(x => x.remain > 0);
    game.bombs.forEach(bomb => {
        bomb.remain--;
        if (bomb.remain > 0) {
            return;
        }
        let speed = 2;
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
        switch (ball.direction) {
            case 8: ball.point.y--; break;
            case 6: ball.point.x++; break;
            case 2: ball.point.y++; break;
            case 4: ball.point.x--; break;
            default: throw new Error();
        }
        ball.remain = FPS / ball.speed;
    });

    game.tick++;
}

function move(input: Input, player: Point, lands: Land[][]) {
    const width = lands[0].length;
    const height = lands.length;

    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    let targetX = player.x + x;
    let targetY = player.y + y;
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
    player.x = targetX;
    player.y = targetY;
}
