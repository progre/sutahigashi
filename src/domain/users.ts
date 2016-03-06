import {getLogger} from "log4js";
let logger = getLogger();
import {User} from "./status";

export default class Users {
    private items = <User[]>[];

    join(user: User) {
        if (this.items.length >= 4) {
            return;
        }
        if (user.name == null || user.name.length == null
            || user.name.length <= 0 || user.name.length > 32) {
            logger.warn(`Invalid name: ${userToString(user)}`);
            return false;
        }
        if (this.items.findIndex(x => x.id === user.id) >= 0) {
            logger.warn(`Already joined: ${userToString(user)}`);
            return false;
        }
        if (this.items.findIndex(x => x.name === user.name) >= 0) {
            logger.warn(`Reject reason same name: ${userToString(user)}`);
            return false;
        }
        this.items.push(user);
        logger.info(`${userToString(user)} joined. (users: ${this.length})`);
        return true;
    }

    leave(id: string) {
        let idx = this.items.findIndex(x => x.id === id);
        if (idx < 0) {
            logger.info(`Unjoined: ${id}`);
            return null;
        }
        let user = this.items[idx];
        this.items.splice(idx, 1);
        logger.info(`${userToString(user)} leaved. (users: ${this.length})`);
        return user;
    }

    get length() {
        return this.items.length;
    }

    map<U>(callbackfn: (value: User, index: number, array: User[]) => U, thisArg?: any) {
        return this.items.map(callbackfn);
    }

    idIndexOf(id: string) {
        return this.items.findIndex(x => x.id === id);
    }
}

function userToString(user: User) {
    return `${user.name}@${user.id}`;
}
