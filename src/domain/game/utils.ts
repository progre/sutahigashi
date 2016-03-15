import {Game, Item, Bomb, Ball, Point, Land, Overlay} from "../status";

export function findFreeArea(game: Game) {
    let area = <Point[]>[];
    game.lands.forEach((line, y) => {
        line.forEach((land, x) => {
            if (land !== Land.NONE) {
                return;
            }
            area.push({ x, y });
        });
    });
    return area
        .filter(x => game.bombs.every(bomb => !equals(x, bomb.point)))
        .filter(x => game.balls.every(ball => !equals(x, ball.point)))
        .filter(x => game.players.every(player => player.point == null || !equals(x, player.point)));
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
