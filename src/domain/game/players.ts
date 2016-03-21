import {Player} from "../status";

export function getBombs(players: Player[]) {
    return players.map(x => x.bombs).reduce((p, c) => p.concat(c));
}
