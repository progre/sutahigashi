import {getLogger} from "log4js";
let logger = getLogger();
import {createStatus, update} from "../domain/game/game";
import {FPS} from "../domain/game/definition";
import {Input} from "../domain/game/input";
import Sender from "../infrastructure/sender";
import Synchronizer from "../infrastructure/synchronizer";

export const NAME = "game";

export async function exec(numPlayers: number, sender: Sender, synchronizer: Synchronizer) {
    logger.info("Game starting.");
    let game = createStatus(2);
    synchronizer.on("inputs", onInputs);
    let inputsRepository = <Input[][]>[];
    let waiting = 0;
    let onUpdateTimer: NodeJS.Timer;
    let winner = await new Promise<number>(resolve => {
        onUpdateTimer = setInterval(() => {
            let inputs = inputsRepository[game.tick];
            if (inputs == null) {
                waiting++;
                return;
            }
            if (waiting > 0) {
                logger.info(`Game waited caused by late clients: ${waiting} frame(s)`);
                waiting = 0;
            }
            update(game, inputs);
            if (game.players.filter(x => x.x != null).length <= 1) {
                resolve(game.players.findIndex(x => x.x != null));
            }
            sender.send(NAME, { game });
        }, 1000 / FPS);
    });
    clearInterval(onUpdateTimer);
    synchronizer.removeListener("inputs", onInputs);
    logger.info("Game finished.");
    return winner;

    function onInputs(inputs: Input[]) {
        inputsRepository.push(inputs);
    }
}
