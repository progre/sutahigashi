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
    private timeoutTimers = new Map<SocketIO.Socket, NodeJS.Timer>();
    private dropers = <SocketIO.Socket[]>[];
    private onInput: Function;
    private onDisconnect: Function;

    constructor(private sockets: SocketIO.Socket[]) {
        super();
        this.inputsRepository = new MultiItemArray<Input>(sockets.length);
        let self = this;
        this.onInput = function(input: Input) {
            let sender = <SocketIO.Socket>this;
            tryCatch(() => {
                clearTimeout(self.timeoutTimers.get(sender));
                input.number = sockets.findIndex(x => x === sender);
                self.addNewInput(input);
                self.timeoutTimers.set(sender, setTimeout(() => {
                    self.dropers.push(sender);
                    self.suicide(sender);
                }, 1 * 1000));
            });
        };
        this.onDisconnect = function() {
            tryCatch(() => {
                let sender = <SocketIO.Socket>this;
                self.suicide(sender);
            });
        };
        sockets.forEach((socket, i) => {
            socket.on("input", this.onInput);
            socket.on("disconnect", this.onDisconnect);
        });
    }

    get allDisconnected() {
        return this.sockets.every(x => x.disconnected);
    }

    close() {
        this.sockets.forEach(socket => {
            socket.removeListener("input", this.onInput);
            socket.removeListener("disconnect", this.onDisconnect);
        });
    }

    private suicide(socket: SocketIO.Socket) {
        let input = {
            number: this.sockets.findIndex(x => x === socket),
            up: false,
            down: false,
            left: false,
            right: false,
            bomb: false,
            suicide: true
        };
        this.addNewInput(input);
    }

    private addNewInput(input: Input) {
        this.suicideDropers();
        this.inputsRepository.pushOffset(input.number, input);
        if (this.inputsRepository.filled(0)) {
            let inputs = this.inputsRepository.shift();
            this.emit("inputs", inputs);
        }
    }

    private suicideDropers() {
        let droperIds = this.sockets.filter(socket => socket.disconnected)
            .concat(this.dropers)
            .map(socket => this.sockets.findIndex(x => x === socket));
        if (droperIds.length <= 0) {
            return;
        }
        let current = this.inputsRepository.getOrCreateFirst();
        droperIds.forEach(droperId => {
            current[droperId] = {
                number: droperId,
                up: false,
                down: false,
                left: false,
                right: false,
                bomb: false,
                suicide: true
            };
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
