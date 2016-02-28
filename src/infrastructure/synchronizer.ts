import {EventEmitter} from "events";
const merge = require("merge");
import {getLogger} from "log4js";
let logger = getLogger();
import {Input} from "../domain/input";
import MultiItemArray from "../domain/multiitemarray";
import {Status} from "../domain/status";
import Users, {LIMIT} from "../domain/users";
import {VERSION} from "../domain/version";

export default class Synchronizer extends EventEmitter {
    private scene: string;
    private users = new Users();
    private inputsRepository = new MultiItemArray<Input>(LIMIT);

    constructor(private io: SocketIO.Server) {
        super();
        io.on("connection", socket => {
            logger.debug("connected");

            socket.on("disconnect", () => {
                logger.debug("disconnected");
                this.users.tryLeave(socket);
            });

            socket.on("getstatus", () => {
                socket.emit("status", createStatus(this.scene, this.users));
            });

            socket.on("join", (name: string) => {
                this.users.tryJoin({ socket, name });
            });

            socket.on("leave", () => {
                this.users.tryLeave(socket);
            });

            socket.on("input", (input: Input) => {
                let number = this.users.socketIndexOf(socket);
                if (number < 0) {
                    return;
                }
                input.number = number;
                this.inputsRepository.pushOffset(input.number, input);
                if (this.inputsRepository.filled(0)) {
                    let inputs = this.inputsRepository.shift();
                    this.emit("inputs", inputs);
                }
            });
        });
        this.users.on("update", () => {
            this.emit("usersupdate", this.users);
        });
    }

    startScene(scene: string) {
        this.scene = scene;
        this.postScene(scene, null);
    }

    postScene(scene: string, obj: Status) {
        this.io.emit("status", merge(createStatus(scene, this.users), obj));
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

function createStatus(scene: string, users: Users) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    status.users = users.map(x => ({ name: x.name }));
    return status;
}

