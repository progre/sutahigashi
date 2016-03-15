import * as status from "../status";
import * as objects from "./objects";
import {FPS} from "./definition";

export function updateBombs(bombs: status.Bomb[], balls: status.Ball[]) {
    bombs
        .forEach(bomb => {
            bomb.remain--;
        });
    bombs
        .filter(bomb => bomb.remain <= 0
            || balls.some(ball => objects.ballTouchedToBomb(ball, bomb)))
        .forEach(bomb => {
            bomb.remain = 0;
            for (let ball of createBallsForEight(bomb.point)) {
                balls.push(ball);
            }
        });
}

function createBallsForNormal(point: status.Point) {
    let speed = 4;
    let remain = FPS / speed;
    return [
        {
            speed,
            remain,
            direction: 8,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 6,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 2,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 4,
            point: { x: point.x, y: point.y }
        }
    ];
}

function createBallsForEight(point: status.Point) {
    let speed = 4;
    let remain = FPS / speed;
    let skewSpeed = speed / Math.SQRT2;
    let skewRemain = FPS / skewSpeed;
    return [
        {
            speed,
            remain,
            direction: 8,
            point: { x: point.x, y: point.y }
        },
        {
            speed: skewSpeed,
            remain: skewRemain,
            direction: 9,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 6,
            point: { x: point.x, y: point.y }
        },
        {
            speed: skewSpeed,
            remain: skewRemain,
            direction: 3,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 2,
            point: { x: point.x, y: point.y }
        },
        {
            speed: skewSpeed,
            remain: skewRemain,
            direction: 1,
            point: { x: point.x, y: point.y }
        },
        {
            speed,
            remain,
            direction: 4,
            point: { x: point.x, y: point.y }
        },
        {
            speed: skewSpeed,
            remain: skewRemain,
            direction: 7,
            point: { x: point.x, y: point.y }
        }
    ];
}
