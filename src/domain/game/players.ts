import {Player} from "../status";
import {Input} from "./input";
import * as bombs from "./bombs";

export function getBombs(players: Player[]) {
    return players.map(x => x.bombs).reduce((p, c) => p.concat(c));
}

export function putPlayersBomb(
    players: Player[],
    inputs: Input[]
) {
    inputs.forEach((input, i) => {
        putBomb(players[i], input);
    });
}

export function putBomb(
    player: Player,
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
    players: Player[],
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
