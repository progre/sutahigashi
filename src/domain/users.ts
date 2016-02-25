export default class Users {
    private items = <User[]>[];

    join(user: User) {
        if (user.name == null || user.name.length == null
            || user.name.length <= 0 || user.name.length > 32) {
            throw new Error("Invalid name");
        }
        if (this.items.findIndex(x => x.socket === user.socket) >= 0) {
            throw new Error("Already joined");
        }
        this.items.push(user);
    }

    tryLeave(socket: SocketIO.Socket) {
        let idx = this.items.findIndex(x => x.socket === socket);
        if (idx < 0) {
            return null;
        }
        let user = this.items[idx];
        this.items.splice(idx, 1);
        return user;
    }

    leave(socket: SocketIO.Socket) {
        let user = this.tryLeave(socket);
        if (user == null) {
            throw new Error("Unjoined");
        }
        return user;
    }

    get length() {
        return this.items.length;
    }

    map<U>(callbackfn: (value: User, index: number, array: User[]) => U, thisArg?: any) {
        return this.items.map(callbackfn);
    }
}

interface User {
    name: string;
    socket: SocketIO.Socket;
}
