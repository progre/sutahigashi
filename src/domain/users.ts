import {getLogger} from "log4js";
let logger = getLogger();

export default class Users {
    private items = <User[]>[];

    tryJoin(user: User) {
        if (this.items.length >= 4) {
            return;
        }
        if (user.name == null || user.name.length == null
            || user.name.length <= 0 || user.name.length > 32) {
            logger.warn(`Invalid name: ${userToString(user)}`);
            return false;
        }
        if (this.items.findIndex(x => x.socket === user.socket) >= 0) {
            logger.warn(`Already joined: ${userToString(user)}`);
            return false;
        }
        this.items.push(user);
        logger.info(`${userToString(user)} joined. (users: ${this.length})`);
        return true;
    }

    tryLeave(socket: SocketIO.Socket) {
        let idx = this.items.findIndex(x => x.socket === socket);
        if (idx < 0) {
            logger.info(`Unjoined: ${socket.client.conn.remoteAddress}`);
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

    socketIndexOf(socket: SocketIO.Socket) {
        return this.items.findIndex(x => x.socket === socket);
    }
}

interface User {
    name: string;
    socket: SocketIO.Socket;
}

function userToString(user: User) {
    return `${user.name}@${user.socket.client.conn.remoteAddress}`;
}
