const merge = require("merge");
import {Status} from "../domain/status";
import {VERSION} from "../domain/version";

export default class Sender {
    constructor(private io: SocketIO.Server, private status: Status) {
    }

    send(scene: string, obj: Status) {
        this.status = merge(createStatus(scene), obj);
        this.io.emit("status", this.status);
    }

    get lastStatus() {
        return this.status;
    }
}

function createStatus(scene: string) {
    let status = <Status>{};
    status.version = VERSION;
    status.scene = scene;
    return status;
}
