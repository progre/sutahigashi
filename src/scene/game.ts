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
    if (!receiver.allDisconnected) {
        await mainLoop(inputsRepository, game, sender);
    }
    receiver.removeListener("inputs", onInputs);
    logger.info("Game finished.");
    return game.players.findIndex(x => x.point != null);
}

function mainLoop(inputsRepository: Input[][], game: Game, sender: Sender) {
    return new Promise<number>(resolve => {
        let loop = new MainLoop();
        let timer = setInterval(() => {
            if (!loop.tick(inputsRepository, game, sender)) {
                clearInterval(timer);
                resolve();
            }
        }, 1000 / FPS);
    });
}

class MainLoop {
    private waiting = 0;

    tick(inputsRepository: Input[][], game: Game, sender: Sender) {
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
