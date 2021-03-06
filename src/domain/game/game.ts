import * as seedrandom from "seedrandom";
const rnd = seedrandom("remilia_");
import * as status from "../status";
import {createField} from "./field";
import {Input} from "./input";
import * as objects from "./objects";
import * as bombs from "./bombs";
import * as players from "./players";
import {FIELD_WIDTH} from "./definition";

export function createStatus(players: { id: string, name: string }[]) {
    let {lands, overlays} = createField();
    let status = <status.Game>{
        tick: 0,
        players: players.map((x, i) => ({
            id: x.id,
            name: x.name,
            point: getDefaultPoint(i),
            ability: [],
            bombs: <status.Bomb[]>[],
            maxBomb: 1,
            direction: 2,
            attackWait: 0
        })),
        items: <status.Item[]>[],
        balls: <status.Ball[]>[],
        lands,
        overlays
    };
    return status;
}

function getDefaultPoint(i: number) {
    return [
        { x: 1, y: 1 },
        { x: 13, y: 11 },
        { x: 13, y: 1 },
        { x: 1, y: 11 }
    ][i];
}

export function update(game: status.Game, inputs: Input[]) {
    let bombList = players.getBombs(game.players);
    players.movePlayers(game.players, game, inputs);
    players.putPlayersBomb(game.players, inputs);
    players.suicide(game.players, inputs);
    let actives = cleanup(game.players);
    burn(game.balls, actives, game.overlays, game.items);
    game.balls = cleanup(game.balls);
    actives = cleanup(game.players);
    game.items = cleanup(game.items);
    pickup(actives, game.items);
    game.items = cleanup(game.items);
    objects.moveBalls(game.balls, game, game.items, rnd);
    game.balls = cleanup(game.balls);
    players.putPlayersAttack(game.players, game.balls, inputs, game);
    bombs.updateBombs(bombList, game.balls); // 誘爆させたボムをすぐに弾にするのでボムは後
    game.players.forEach(player => {
        player.bombs = player.bombs.filter(x => x.remain > 0);
    });
    game.tick++;
}

function burn(balls: status.Ball[], actives: status.Player[], overlays: status.Overlay[], items: status.Item[]) {
    balls.forEach(ball => {
        for (let item of items) {
            if (objects.ballTouchedToItem(ball, item)) {
                item.point = null;
                ball.point = null;
                items = cleanup(items);
                return;
            }
        }
        for (let player of actives) {
            if (objects.ballTouchedToPlayer(ball, player)) {
                player.point = null;
                ball.point = null;
                actives = cleanup(actives);
                return;
            }
        }
        let idx = ball.point.y * FIELD_WIDTH + ball.point.x;
        if (overlays[idx] === status.Overlay.SOFT_BLOCK) {
            overlays[idx] = status.Overlay.NONE;
            let item = objects.createItem(rnd, ball.point);
            if (item != null) {
                items.push(item);
            }
            ball.point = null;
        }
    });
}

function pickup(actives: status.Player[], items: status.Item[]) {
    actives.forEach(player => {
        items.forEach(item => {
            if (!objects.playerTouchedToItem(player, item)) {
                return;
            }
            item.point = null;
            player.ability.push(item.ability);
            switch (item.ability) {
                case status.Ability.BOMB_UP:
                    player.maxBomb++;
                    break;
                default:
                    break;
            }
        });
        items = cleanup(items);
    });
}

function cleanup<T extends { point: status.Point }>(objects: T[]) {
    return objects.filter(x => x.point != null);
}
