import {RoomReceiver} from "../infrastructure/receiver";
import Sender from "../infrastructure/sender";
import {User} from "../domain/status";
import Users from "../domain/users";

export const NAME = "lobby";

export default function lobby(roomReceiver: RoomReceiver, sender: Sender, previousVisitor: User) {
    return new Promise<User[]>(resolve => {
        let users = new Users();
        if (previousVisitor != null) {
            users.join(previousVisitor);
        }
        sender.send(NAME, {
            lobby: { users: users.map(x => x) }
        });
        let onLeave = (socket: SocketIO.Socket) => {
            users.leave(socket.id);
            sender.send(NAME, {
                lobby: { users: users.map(x => x) }
            });
        };
        let onJoin = (socket: SocketIO.Socket, name: string) => {
            users.join({ id: socket.id, name, wins: 0 });
            sender.send(NAME, {
                lobby: { users: users.map(x => x) }
            });
            if (users.length < 3) {
                return;
            }
            roomReceiver.removeListener("leave", onLeave);
            roomReceiver.removeListener("join", onJoin);
            resolve(users.map(x => x));
        };
        roomReceiver.on("leave", onLeave);
        roomReceiver.on("join", onJoin);
    });
}
