const merge = require("merge");
import {Status} from "../domain/status";
import Users from "../domain/users";
import {VERSION} from "../domain/version";

export default class Sender {
    constructor(private io: SocketIO.Server) {
    }

    send(scene: string, users: Users, obj: Status) {
        this.io.emit("status", merge(createStatus(scene, users), obj));
    }
}

function createStatus(scene: string, users: Users) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    return status;
}
