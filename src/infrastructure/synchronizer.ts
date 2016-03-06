import {EventEmitter} from "events";
import {getLogger} from "log4js";
let logger = getLogger();
import {Input} from "../domain/game/input";
import MultiItemArray from "../domain/multiitemarray";
import Users from "../domain/users";
import Sender from "./sender";

export default class Synchronizer extends EventEmitter {
    constructor(private io: SocketIO.Server, private users: Users, sender: Sender) {
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
                socket.emit("status", sender.lastStatus);
            }));
        });
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
