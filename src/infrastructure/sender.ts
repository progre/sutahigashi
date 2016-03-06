const merge = require("merge");
import {Status} from "../domain/status";
import {VERSION} from "../domain/version";

export default class Sender {
    constructor(private io: SocketIO.Server) {
    }

    send(scene: string, obj: Status) {
        this.io.emit("status", merge(createStatus(scene), obj));
    }
}

function createStatus(scene: string) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    return status;
}
