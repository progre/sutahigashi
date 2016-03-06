import {EventEmitter} from "events";
import Users from "../domain/users";

export const NAME = "lobby";

export default class Lobby extends EventEmitter {
    constructor(public users: Users) {
        super();
    }

    join(socket: SocketIO.Socket, name: string) {
        this.users.tryJoin({ socket, name });
        if (this.users.length < 2) {
            return;
        }
        this.emit("end", this.users.length);
    }

    leave(socket: SocketIO.Socket) {
        return this.users.tryLeave(socket);
    }
}
