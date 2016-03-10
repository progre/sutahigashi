import {getLogger} from "log4js";
let logger = getLogger();
import {createStatus, update} from "../domain/game/game";
import {FPS} from "../domain/game/definition";
import {Input} from "../domain/game/input";
import {InputReceiver} from "../infrastructure/receiver";
import Sender from "../infrastructure/sender";

const NAME = "game";

export default async function game(players: string[], receiver: InputReceiver, sender: Sender) {
    logger.info("Game starting.");
    sender.send(NAME, null);
    let game = createStatus(players);
    let inputsRepository = <Input[][]>[];
    let onInputs = (inputs: Input[]) => {
        inputsRepository.push(inputs);
    };
    receiver.on("inputs", onInputs);
    let waiting = 0;
    let onUpdateTimer: NodeJS.Timer;
    let winner = await new Promise<number>(resolve => {
        if (receiver.allDisconnected) {
            resolve(-1);
            return;
        }
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
            if (game.players.filter(x => x.point != null).length <= 1) {
                resolve(game.players.findIndex(x => x.point != null));
            }
            sender.send(NAME, { game });
        }, 1000 / FPS);
    });
    clearInterval(onUpdateTimer);
    receiver.removeListener("inputs", onInputs);
    logger.info("Game finished.");
    return winner;
}
