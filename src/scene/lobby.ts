import {RoomReceiver} from "../infrastructure/receiver";
import Sender from "../infrastructure/sender";
import Users from "../domain/users";

export const NAME = "lobby";

export default function lobby(roomReceiver: RoomReceiver, sender: Sender) {
    return new Promise<Users>(resolve => {
        let users = new Users();
        sender.send(NAME, {
            users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
        });
        let onLeave = (socket: SocketIO.Socket) => {
            this.users.leave(socket.id);
            sender.send(NAME, {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
        };
        let onJoin = (socket: SocketIO.Socket, name: string) => {
            this.users.join({ id: socket.id, name });
            sender.send(NAME, {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
            if (this.users.length < 2) {
                return;
            }
            roomReceiver.removeListener("leave", onLeave);
            roomReceiver.removeListener("join", onJoin);
            resolve(users);
        };
        roomReceiver.on("leave", onLeave);
        roomReceiver.on("join", onJoin);
    });
}
