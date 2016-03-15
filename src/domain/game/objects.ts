import * as status from "../status";
import {FPS} from "./definition";
import {Input} from "./input";

const BOMB_DEFAULT_REMAIN = FPS * 2.5;

export function movePlayers(players: status.Player[], lands: status.Land[][], bombs: status.Bomb[], inputs: Input[]) {
    inputs.forEach((input, i) => {
        let player = players[i];
        if (player.point == null) {
            return;
        }
        movePlayer(input, player.point, lands, bombs);
        if (input.bomb) {
            bombs.push({ remain: BOMB_DEFAULT_REMAIN, point: { x: player.point.x, y: player.point.y } });
        }
        if (input.suicide) {
            player.point = null;
        }
    });
}

function movePlayer(input: Input, player: status.Point, lands: status.Land[][], bombs: status.Bomb[]) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    moveObjectPoint(player, x, y, lands, bombs);
}

export function moveBalls(balls: status.Ball[], lands: status.Land[][]) {
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
    moveObjectPoint(ball.point, x, y, lands, []);
    if (ball.point.x === oldX && ball.point.y === oldY) {
        ball.point = null;
    }
}

function moveObjectPoint(point: status.Point, x: number, y: number, lands: status.Land[][], bombs: status.Bomb[]) {
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
    if (lands[targetY][targetX] === status.Land.HARDBLOCK
        || bombs.some(bomb => targetX === bomb.point.x && targetY === bomb.point.y)) {
        return;
    }
    point.x = targetX;
    point.y = targetY;
}

export function ballTouchedToPlayer(ball: status.Ball, player: status.Player) {
    return player.point.x === ball.point.x && player.point.y === ball.point.y;
}

export function ballTouchedToItem(ball: status.Ball, item: status.Item) {
    return item.point.x === ball.point.x && item.point.y === ball.point.y;
}

export function ballTouchedToBomb(ball: status.Ball, bomb: status.Bomb) {
    return bomb.point.x === ball.point.x && bomb.point.y === ball.point.y;
}

export function playerTouchedToItem(player: status.Player, item: status.Item): boolean {
    return player.point.x === item.point.x && player.point.y === item.point.y;
}
