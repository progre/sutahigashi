import {getLogger} from "log4js";
let logger = getLogger();
import {Game, Player} from "../domain/status";
import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import {Input} from "../domain/input";
import * as result from "./result";

export const NAME = "game";

export async function exec(synchronizer: Synchronizer, users: Users) {
    logger.info("Game starting.");
    synchronizer.postScene(NAME);
    let sockets = synchronizer.io.sockets.sockets;
    eachSockets(sockets, x => x.addListener("inputs", onInput));
    let inputsRepository = <Input[][]>[];
    let game = {
        tick: 0,
        players: [
            { x: 1, y: 1 }
        ]
    };
    let onUpdateTimer = setInterval(() => {
        let inputs = inputsRepository[game.tick];
        if (inputs == null) {
            return;
        }
        updateGame(game, inputs)
        synchronizer.postScene(NAME, { game });
    }, 33);
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10 * 1000);
    });

    eachSockets(sockets, x => x.removeListener("inputs", onInput));
    clearInterval(onUpdateTimer);
    logger.info("Game finished.");
    return result;

    function onInput(input: Input) {
        inputsRepository.push([input]);
    }
}

function updateGame(game: Game, inputs: Input[]) {
    move(inputs[0], game.players[0]);
    game.tick++;
}

function eachSockets(
    sockets: typeof Synchronizer.prototype.io.sockets.sockets,
    func: (socket: SocketIO.Socket) => void
) {
    for (let id in sockets) {
        if (sockets.hasOwnProperty(id)) {
            func(sockets[id]);
        }
    }
}

function move(input: Input, player: { x: number, y: number }) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    player.x += x;
    player.y += y;
}

