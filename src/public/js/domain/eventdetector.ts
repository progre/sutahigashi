import {EventEmitter} from "events";
import {Game, Point, Bomb, Ball, Player} from "../../../domain/status";

export default class EventDetector extends EventEmitter {
    private previous: Game;

    update(current: Game) {
        if (this.previous != null) {
            this.check(this.previous, current);
        }
        this.previous = current;
    }

    private check(previous: Game, current: Game) {
        if (current.bombs.some(bomb => isNewBomb(bomb, previous.bombs))) {
            this.emit("put");
        }
        if (current.balls.some(ball => isFromBomb(ball, previous.bombs))) {
            this.emit("explosion");
        }
        if (current.players.some((player, i) => isDead(player, previous.players[i]))) {
            this.emit("death");
        }
    }
}

function isNewBomb(bomb: Bomb, previousBombs: Bomb[]) {
    return previousBombs.every(x => !equals(bomb.point, x.point));
}

function isFromBomb(ball: Ball, previousBombs: Bomb[]) {
    return previousBombs.some(x => equals(ball.point, x.point));
}

function isDead(current: Player, previous: Player) {
    return current.point == null && previous.point != null;
}

function equals(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
}
