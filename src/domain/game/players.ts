import * as status from "../status";
import {FIELD_WIDTH} from "./definition";
import {Input} from "./input";
import * as bombs from "./bombs";
import * as objects from "./objects";

export function getBombs(players: status.Player[]) {
    return players.map(x => x.bombs).reduce((p, c) => p.concat(c));
}

export function movePlayers(
    players: status.Player[],
    game: status.Game,
    inputs: Input[]
) {
    inputs.forEach((input, i) => {
        let player = players[i];
        movePlayer(input, player, game);
    });
}

export function movePlayer(
    input: Input,
    player: status.Player,
    game: status.Game
) {
    if (player.point == null) {
        return;
    }
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    if (x < 0) {
        player.direction = 4;
    } else if (0 < x) {
        player.direction = 6;
    } else if (y < 0) {
        player.direction = 8;
    } else if (0 < y) {
        player.direction = 2;
    }
    player.point = movePlayerPoint(player.point, x, y, game);
}

function movePlayerPoint(
    point: status.Point,
    x: number, y: number,
    game: status.Game
) {
    let {x: targetX, y: targetY} = objects.movePoint(point, x, y);
    let bombs = getBombs(game.players);
    if (game.lands[targetY * FIELD_WIDTH + targetX] !== status.Land.NONE
        || game.overlays[targetY * FIELD_WIDTH + targetX] !== status.Overlay.NONE
        || bombs.some(bomb => targetX === bomb.point.x && targetY === bomb.point.y)) {
        return point;
    }
    return { x: targetX, y: targetY };
}

export function putPlayersBomb(
    players: status.Player[],
    inputs: Input[]
) {
    inputs.forEach((input, i) => {
        putBomb(players[i], input);
    });
}

export function putBomb(
    player: status.Player,
    input: Input
) {
    if (player.point == null) {
        return;
    }
    if (input.bomb && player.maxBomb > player.bombs.length) {
        player.bombs.push(bombs.createBomb(player.point, player.ability));
    }
}

export function suicide(
    players: status.Player[],
    inputs: Input[]
) {
    inputs.forEach((input, i) => {
        let player = players[i];
        if (player.point == null) {
            return;
        }
        if (input.suicide) {
            player.point = null;
        }
    });
}
