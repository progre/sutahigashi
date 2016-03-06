import {EventEmitter} from "events";
import {getLogger} from "log4js";
let logger = getLogger();
import {Input} from "../domain/game/input";
import MultiItemArray from "../domain/multiitemarray";
import {Status} from "../domain/status";
import Users from "../domain/users";
import Sender from "./sender";

export default class Synchronizer extends EventEmitter {
    private scene: string;
    private inputsRepository: MultiItemArray<Input>;

    constructor(private io: SocketIO.Server, private users: Users) {
        super();
        io.on("connection", socket => {
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

            socket.on("getstatus", () => tryCatch(() => {
                new Sender(this.io).send(this.scene, null);
            }));

            socket.on("input", (input: Input) => tryCatch(() => {
                let number = this.users.idIndexOf(socket.id);
                if (number < 0) {
                    return;
                }
                input.number = number;
                this.inputsRepository.pushOffset(input.number, input);
                if (this.inputsRepository.filled(0)) {
                    let inputs = this.inputsRepository.shift();
                    this.emit("inputs", inputs);
                }
            }));
        });
    }

    startScene(scene: string, obj: Status) {
        this.scene = scene;
        new Sender(this.io).send(scene, obj);
        this.inputsRepository = new MultiItemArray<Input>(this.users.length);
    }

    forEachSockets(func: (socket: SocketIO.Socket) => void) {
        asArray(this.io.sockets.sockets).forEach(x => {
            func(x);
        });
    }

    forEachPlayerSockets(func: (socket: SocketIO.Socket) => void) {
        console.log("length:", asArray(this.io.in("players").sockets).length);
        asArray(this.io.in("players").sockets).forEach(x => {
            func(x);
        });
    }
}

function asArray<T>(arrayLike: { [idx: number]: T }) {
    let array = <T[]>[];
    for (let idx in arrayLike) {
        if (arrayLike.hasOwnProperty(idx)) {
            array.push(arrayLike[idx]);
        }
    }
    return array;
}

function tryCatch(func: Function) {
    try {
        func();
    } catch (e) {
        logger.error(e.stack != null ? e.stack : e);
    }
}
