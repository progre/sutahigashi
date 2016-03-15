import * as seedrandom from "seedrandom";
const rnd = seedrandom("remilia");
import * as status from "../status";
import {createField} from "./field";
import {Input} from "./input";
import * as utils from "./utils";
import * as objects from "./objects";
import * as bombs from "./bombs";

export function createStatus(players: string[]) {
    let status = {
        tick: 0,
        players: players.map((x, i) => ({
            name: x,
            point: getDefaultPoint(i),
            ability: []
        })),
        items: <status.Item[]>[],
        bombs: <status.Bomb[]>[],
        balls: <status.Ball[]>[],
        lands: createField(),
        overlays: <status.Overlay[][]>[]
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
    objects.movePlayers(game.players, game.lands, game.bombs, inputs);
    let actives = cleanup(game.players);
    burn(game.balls, actives, game.items);
    game.balls = cleanup(game.balls);
    actives = cleanup(game.players);
    game.items = cleanup(game.items);
    pickup(actives, game.items);
    game.items = cleanup(game.items);
    objects.moveBalls(game.balls, game.lands);
    game.balls = cleanup(game.balls);
    bombs.updateBombs(game.bombs, game.balls); // 誘爆させたボムをすぐに弾にするのでボムは後
    game.bombs = game.bombs.filter(x => x.remain > 0);
    if (rnd() < 0.01) {
        let lands = utils.findFreeArea(game);
        let point = lands[utils.random(rnd, 0, lands.length)];
        const ABILITIES = [status.Ability.EIGHT_BOMB];
        let ability = ABILITIES[utils.random(rnd, 0, ABILITIES.length)];
        console.log(ability);
        game.items.push({ point, ability });
    }
    game.tick++;
    if (game.items.some(item => item.point == null)) { console.log(game.items); throw new Error(); }
}

function burn(balls: status.Ball[], actives: status.Player[], items: status.Item[]) {
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
    });
}

function pickup(actives: status.Player[], items: status.Item[]) {
    actives.forEach(player => {
        items.forEach(item => {
            if (!objects.playerTouchedToItem(player, item)) {
                return;
            }
            item.point = null;
            player.ability.push(status.Ability.EIGHT_BOMB);
        });
        items = cleanup(items);
    });
}

function cleanup<T extends { point: status.Point }>(objects: T[]) {
    return objects.filter(x => x.point != null);
}
