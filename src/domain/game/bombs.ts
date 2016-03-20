import * as status from "../status";
import * as objects from "./objects";
import {FPS} from "./definition";

const BOMB_DEFAULT_REMAIN = FPS * 2.5;

export function createBomb(player: status.Player) {
    let ability = player.ability.indexOf(status.Ability.EIGHT_BOMB) >= 0
        ? status.Ability.EIGHT_BOMB
        : null;
    return {
        remain: BOMB_DEFAULT_REMAIN,
        point: { x: player.point.x, y: player.point.y },
        ability,
        author: player,
        ballSpeed: createSpeed(player.ability)
    };
}

function createSpeed(abilities: status.Ability[]) {
    let speed = abilities.filter(x => x === status.Ability.SPEED).length;
    let slow = abilities.filter(x => x === status.Ability.SLOW).length;
    return 4 * (1.5 ** speed) * (0.75 ** slow);
}

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
            let newBalls = bomb.ability === status.Ability.EIGHT_BOMB
                ? createBallsFromEight(bomb.point, bomb.ballSpeed)
                : createBallsFromNormal(bomb.point, bomb.ballSpeed);
            for (let ball of newBalls) {
                balls.push(ball);
            }
            bomb.author.remainBomb++;
        });
}

function createBallsFromNormal(point: status.Point, speed: number) {
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

function createBallsFromEight(point: status.Point, speed: number) {
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
