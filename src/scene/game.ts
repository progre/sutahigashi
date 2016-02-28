import {getLogger} from "log4js";
let logger = getLogger();
import {Game, Player} from "../domain/status";
import Synchronizer from "../infrastructure/synchronizer";
import {Input} from "../domain/input";
import * as result from "./result";
import {LIMIT} from "../domain/users";

export const NAME = "game";

export async function exec(synchronizer: Synchronizer) {
    logger.info("Game starting.");
    synchronizer.on("inputs", onInputs);
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
        updateGame(game, inputs);
        synchronizer.postScene(NAME, { game });
    }, 33);
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10 * 1000);
    });

    synchronizer.removeListener("inputs", onInputs);
    clearInterval(onUpdateTimer);
    logger.info("Game finished.");
    return result;

    function onInputs(inputs: Input[]) {
        inputsRepository.push(inputs);
    }
}

function updateGame(game: Game, inputs: Input[]) {
    move(inputs[0], game.players[0]);
    game.tick++;
}

function move(input: Input, player: Player) {
    let x: number = -<any>input.left + <any>input.right;
    let y: number = -<any>input.up + <any>input.down;
    player.x += x;
    player.y += y;
}

