import {getLogger} from "log4js";
let logger = getLogger();
import {Game} from "../domain/status";
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
    let mainLoop = new MainLoop();
    let onUpdateTimer: NodeJS.Timer;
    await new Promise<number>(resolve => {
        if (receiver.allDisconnected) {
            resolve(-1);
            return;
        }
        onUpdateTimer = setInterval(() => {
            if (!mainLoop.exec(inputsRepository, game, sender)) {
                resolve();
            }
        }, 1000 / FPS);
    });
    let winner = game.players.findIndex(x => x.point != null);
    clearInterval(onUpdateTimer);
    receiver.removeListener("inputs", onInputs);
    logger.info("Game finished.");
    return winner;
}

class MainLoop {
    private waiting = 0;

    exec(inputsRepository: Input[][], game: Game, sender: Sender) {
        let inputs = inputsRepository[game.tick];
        if (inputs == null) {
            this.waiting++;
            return true;
        }
        if (this.waiting > 0) {
            logger.info(`Game waited caused by late clients: ${this.waiting} frame(s)`);
            this.waiting = 0;
        }
        update(game, inputs);
        if (game.players.filter(x => x.point != null).length <= 1) {
            return false;
        }
        sender.send(NAME, { game });
        return true;
    }
}
