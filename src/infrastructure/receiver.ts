import {EventEmitter} from "events";
import {getLogger} from "log4js";
let logger = getLogger();
import MultiItemArray from "../domain/multiitemarray";
import {Input} from "../domain/game/input";

export class InputReceiver extends EventEmitter {
    private inputsRepository: MultiItemArray<Input>;
    private onInput: Function;

    constructor(private sockets: SocketIO.Socket[]) { // TODO: Namespace使えないか
        super();
        this.inputsRepository = new MultiItemArray<Input>(sockets.length);
        let self = this;
        this.onInput = function(input: Input) {
            try {
                let sender = this;
                input.number = sockets.findIndex(x => x === sender);
                self.inputsRepository.pushOffset(input.number, input);
                if (self.inputsRepository.filled(0)) {
                    let inputs = self.inputsRepository.shift();
                    self.emit("inputs", inputs);
                }
            } catch (e) {
                logger.error(e.stack != null ? e.stack : e);
            }
        };
        sockets.forEach((socket, i) => {
            socket.on("input", this.onInput);
        });
    }

    close() {
        this.sockets.forEach(socket => {
            socket.removeListener("input", this.onInput);
        });
    }
}
