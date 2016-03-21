import {Game, Point, Land} from "../status";
import {FIELD_WIDTH} from "./definition";
import * as players from "./players";

export function findFreeArea(game: Game) {
    let area = <Point[]>[];
    game.lands.forEach((land, i) => {
        if (land !== Land.NONE) {
            return;
        }
        area.push({ x: i % FIELD_WIDTH, y: Math.floor(i / FIELD_WIDTH) });
    });
    let bombs = players.getBombs(game.players);
    return area
        .filter(x => bombs.every(bomb => !equals(x, bomb.point)))
        .filter(x => game.balls.every(ball => !equals(x, ball.point)))
        .filter(x => game.players
            .every(player => player.point == null || !equals(x, player.point)));
}

export function equals(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
}

export function random(rnd: prng, from: number, to: number) {
    let result = from + Math.floor(to * rnd());
    if (result === to) {
        result = from;
    }
    return result;
}
