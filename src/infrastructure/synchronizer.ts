import {EventEmitter} from "events";
const merge = require("merge");
import {Status} from "../domain/status";
import {VERSION} from "../domain/version";
import Users from "../domain/users";

export default class Synchronizer {
    constructor(
        public io: SocketIO.Server,
        private users: Users
    ) {
    }

    postScene(scene: string, obj?: Status) {
        this.io.emit("status", merge(createStatus(scene, this.users), obj));
    }

    postSceneToUser(socket: SocketIO.Socket, scene: string) {
        socket.emit("status", createStatus(scene, this.users));
    }
}

function createStatus(scene: string, users: Users) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    status.users = users.map(x => ({ name: x.name }));
    return status;
}
