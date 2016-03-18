import * as status from "../status";
import {FPS, FIELD_WIDTH, FIELD_HEIGHT} from "./definition";
import {Input} from "./input";
import * as utils from "./utils";
import * as bombs from "./bombs";

export function movePlayers(
    players: status.Player[],
    lands: status.Land[],
    overlays: status.Overlay[],
    bombList: status.Bomb[],
    inputs: Input[]
) {
    inputs.forEach((input, i) => {
        let player = players[i];
        if (player.point == null) {
            return;
        }
        movePlayer(input, player.point, lands, overlays, bombList);
        if (input.bomb) {
            bombList.push(bombs.createBomb(player));
        }
        if (input.suicide) {
            player.point = null;
        }
    });
}

function movePlayer(
    input: Input,
    player: status.Point,
    lands: status.Land[],
    overlays: status.Overlay[],
    bombs: status.Bomb[]
) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    moveObjectPoint(player, x, y, lands, overlays, bombs);
}

export function moveBalls(
    balls: status.Ball[],
    lands: status.Land[],
    overlays: status.Overlay[],
    items: status.Item[],
    rnd: prng
) {
    balls
        .forEach(ball => {
            ball.remain--;
        });
    balls
        .filter(ball => ball.remain <= 0)
        .forEach(ball => {
            moveBall(ball, lands, overlays, items, rnd);
            ball.remain = FPS / ball.speed - ball.remain;
        });
}

function moveBall(
    ball: status.Ball,
    lands: status.Land[],
    overlays: status.Overlay[],
    items: status.Item[],
    rnd: prng
) {
    let x = 0;
    let y = 0;
    switch (ball.direction) {
        case 8: y = -1; break;
        case 9: x = 1; y = -1; break;
        case 6: x = 1; break;
        case 3: x = 1; y = 1; break;
        case 2: y = 1; break;
        case 1: x = -1; y = 1; break;
        case 4: x = -1; break;
        case 7: x = -1; y = -1; break;
        default: throw new Error();
    }
    let {x: oldX, y: oldY} = ball.point;
    let target = moveObjectPoint(ball.point, x, y, lands, overlays, []);
    if (overlays[target.y * FIELD_WIDTH + target.x] === status.Overlay.SOFT_BLOCK) {
        overlays[target.y * FIELD_WIDTH + target.x] = status.Overlay.NONE;
        let item = createItem(rnd, target);
        if (item != null) {
            items.push(item);
        }
    }
    if (ball.point.x === oldX && ball.point.y === oldY) {
        ball.point = null;
    }
}

function createItem(rnd: prng, point: status.Point) {
    if (rnd() >= 0.1) {
        return null;
    }
    const ABILITIES = [status.Ability.EIGHT_BOMB];
    let ability = ABILITIES[utils.random(rnd, 0, ABILITIES.length)];
    return { point, ability };
}

function moveObjectPoint(
    point: status.Point,
    x: number, y: number,
    lands: status.Land[],
    overlays: status.Overlay[],
    bombs: status.Bomb[]
) {
    let targetX = point.x + x;
    let targetY = point.y + y;
    if (targetX < 0) {
        targetX = 0;
    } else if (targetX >= FIELD_WIDTH) {
        targetX = FIELD_WIDTH - 1;
    }
    if (targetY < 0) {
        targetY = 0;
    } else if (targetY >= FIELD_HEIGHT) {
        targetY = FIELD_HEIGHT - 1;
    }
    if (lands[targetY * FIELD_WIDTH + targetX] !== status.Land.NONE
        || overlays[targetY * FIELD_WIDTH + targetX] !== status.Overlay.NONE
        || bombs.some(bomb => targetX === bomb.point.x && targetY === bomb.point.y)) {
        return { x: targetX, y: targetY };
    }
    point.x = targetX;
    point.y = targetY;
    return { x: targetX, y: targetY };
}

export function ballTouchedToPlayer(ball: status.Ball, player: status.Player) {
    return utils.equals(player.point, ball.point);
}

export function ballTouchedToItem(ball: status.Ball, item: status.Item) {
    return utils.equals(ball.point, item.point);
}

export function ballTouchedToBomb(ball: status.Ball, bomb: status.Bomb) {
    return utils.equals(ball.point, bomb.point);
}

export function playerTouchedToItem(player: status.Player, item: status.Item) {
    return utils.equals(player.point, item.point);
}
