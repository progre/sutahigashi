import {EventEmitter} from "events";
import Users from "../domain/users";

export const NAME = "lobby";

export default class Lobby extends EventEmitter {
    constructor(public users: Users) {
        super();
    }

    join(id: string, name: string) {
        this.users.tryJoin({ id, name });
        if (this.users.length < 2) {
            return;
        }
        this.emit("end", this.users.length);
    }

    leave(id: string) {
        return this.users.tryLeave(id);
    }
}
