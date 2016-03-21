import {EventEmitter} from "events";
import {Game, Point, Bomb, Ball, Player, Item} from "../../../domain/status";

export default class EventDetector extends EventEmitter {
    private previous: Game;

    update(current: Game) {
        if (this.previous != null) {
            this.check(this.previous, current);
        }
        this.previous = current;
    }

    private check(previous: Game, current: Game) {
        let previousBombs = previous.players
            .map(x => x.bombs)
            .reduce((r, c) => r.concat(c));
        let currentBombs = current.players
            .map(x => x.bombs)
            .reduce((r, c) => r.concat(c));
        if (currentBombs.some(bomb => isNewBomb(bomb, previousBombs))) {
            this.emit("put");
        }
        if (current.balls.some(ball => isFromBomb(ball, previousBombs))) {
            this.emit("explosion");
        }
        if (current.players.some((player, i) => isAttacking(player, previous.players[i]))) {
            this.emit("shot");
        }
        if (current.players.some((player, i) => isDead(player, previous.players[i]))) {
            this.emit("death");
        }
        if (current.players
            .filter(player => player.point != null)
            .some(player => isPickuped(player, previous.items))) {
            this.emit("pickup");
        }
        if (previous.players.filter(x => x.point != null).length > 1
            && current.players.filter(x => x.point != null).length <= 1) {
            this.emit("gameset");
        }
    }
}

function isNewBomb(bomb: Bomb, previousBombs: Bomb[]) {
    return previousBombs.every(x => !equals(bomb.point, x.point));
}

function isFromBomb(ball: Ball, previousBombs: Bomb[]) {
    return previousBombs.some(x => equals(ball.point, x.point));
}

function isAttacking(current: Player, previous: Player) {
    return current.attackWait > 0 && previous.attackWait === 0;
}

function isDead(current: Player, previous: Player) {
    return current.point == null && previous.point != null;
}

function isPickuped(current: Player, previousItems: Item[]) {
    return previousItems.some(item => equals(current.point, item.point));
}

function equals(a: Point, b: Point) {
    return a.x === b.x && a.y === b.y;
}
