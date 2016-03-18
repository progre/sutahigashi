import {getLogger} from "log4js";
let logger = getLogger();
import {Game} from "../domain/status";
import {createStatus, update} from "../domain/game/game";
import {FPS} from "../domain/game/definition";
import {Input} from "../domain/game/input";
import {InputReceiver} from "../infrastructure/receiver";
import Sender from "../infrastructure/sender";

const NAME = "game";

export default async function game(
    players: string[],
    receiver: InputReceiver,
    sender: Sender
) {
    logger.info("Game starting.");
    let game = createStatus(players);
    sender.send(NAME, { game });
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
                setTimeout(resolve, 3000);
            }
        }, 1000 / FPS);
    });
}

class MainLoop {
    private waiting = 0;

    tick(inputsRepository: Input[][], game: Game, sender: Sender) {
        let first = true;
        while (true) {
            let inputs = inputsRepository[game.tick];
            if (inputs == null) {
                if (first) {
                    this.waiting++;
                }
                return true;
            }
            if (this.waiting > 0) {
                logger.info(`Game waited caused by late clients: `
                    + `${this.waiting} frame(s)`);
                this.waiting = 0;
            }
            first = false;
            update(game, inputs);
            sender.send(NAME, { game });
            if (game.players.filter(x => x.point != null).length <= 1) {
                return false;
            }
        }
    }
}
