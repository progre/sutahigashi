import * as status from "../status";
import {FPS, FIELD_WIDTH, FIELD_HEIGHT} from "./definition";
import * as utils from "./utils";

export function moveBalls(
    balls: status.Ball[],
    game: status.Game,
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
            moveBall(ball, game, items, rnd);
            ball.remain = FPS / ball.speed - ball.remain;
        });
}

function moveBall(
    ball: status.Ball,
    game: status.Game,
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
    ball.point = moveBallPoint(ball.point, x, y, game);
    if (ball.point.x === oldX && ball.point.y === oldY) {
        ball.point = null;
        return;
    }
    let idx = ball.point.y * FIELD_WIDTH + ball.point.x;
    if (game.overlays[idx] === status.Overlay.SOFT_BLOCK) {
        game.overlays[idx] = status.Overlay.NONE;
        let item = createItem(rnd, ball.point);
        if (item != null) {
            items.push(item);
        }
        ball.point = null;
    }
}

function createItem(rnd: prng, point: status.Point) {
    let random = rnd();
    if (random < 0.7) {
        return null;
    }
    random = (random - 0.7) / 0.3;
    if (random < 0.1) {
        return { point, ability: status.Ability.EIGHT_BOMB };
    }
    if (random < 0.3) {
        return { point, ability: status.Ability.SPEED };
    }
    if (random < 0.5) {
        return { point, ability: status.Ability.SLOW };
    }
    return { point, ability: status.Ability.BOMB_UP };
}

function moveBallPoint(
    point: status.Point,
    x: number, y: number,
    game: status.Game
) {
    let {x: targetX, y: targetY} = movePoint(point, x, y);
    if (game.lands[targetY * FIELD_WIDTH + targetX] !== status.Land.NONE
        || game.overlays[targetY * FIELD_WIDTH + targetX] !== status.Overlay.NONE
        && game.overlays[targetY * FIELD_WIDTH + targetX] !== status.Overlay.SOFT_BLOCK) {
        return point;
    }
    return { x: targetX, y: targetY };
}

export function movePoint(
    point: status.Point,
    x: number, y: number
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
