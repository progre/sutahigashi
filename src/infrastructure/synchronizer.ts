import {EventEmitter} from "events";
const merge = require("merge");
import {getLogger} from "log4js";
let logger = getLogger();
import {Status} from "../domain/status";
import {VERSION} from "../domain/version";
import Users from "../domain/users";

export default class Synchronizer extends EventEmitter {
    private scene: string;
    private users = new Users();

    constructor(public io: SocketIO.Server) {
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
        let sockets = this.io.sockets.sockets;
        for (let id in sockets) {
            if (sockets.hasOwnProperty(id)) {
                func(sockets[id]);
            }
        }
    }
}

function createStatus(scene: string, users: Users) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    status.users = users.map(x => ({ name: x.name }));
    return status;
}
