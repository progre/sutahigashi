import {EventEmitter} from "events";
import {getLogger} from "log4js";
let logger = getLogger();
import MultiItemArray from "../domain/multiitemarray";
import {Input} from "../domain/game/input";

export class RoomReceiver extends EventEmitter {
    constructor(private io: SocketIO.Server) {
        super();
        io.on("connect", socket => {
            logger.debug("connected");

            socket.on("disconnect", () => tryCatch(() => {
                logger.debug("disconnected");
                this.emit("leave", socket);
            }));

            socket.on("join", (name: string) => tryCatch(() => {
                this.emit("join", socket, name);
            }));

            socket.on("leave", () => tryCatch(() => {
                this.emit("leave", socket);
            }));
        });
    }
}

export class InputReceiver extends EventEmitter {
    private inputsRepository: MultiItemArray<Input>;
    private onInput: Function;

    constructor(private sockets: SocketIO.Socket[]) {
        super();
        this.inputsRepository = new MultiItemArray<Input>(sockets.length);
        let self = this;
        this.onInput = function(input: Input) {
            tryCatch(() => {
                let sender = this;
                input.number = sockets.findIndex(x => x === sender);
                self.inputsRepository.pushOffset(input.number, input);
                if (self.inputsRepository.filled(0)) {
                    let inputs = self.inputsRepository.shift();
                    self.emit("inputs", inputs);
                }
            });
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

function tryCatch(func: Function) {
    try {
        func();
    } catch (e) {
        logger.error(e.stack != null ? e.stack : e);
    }
}
