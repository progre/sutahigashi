import Sender from "../infrastructure/sender";
import {InputReceiver} from "../infrastructure/receiver";
import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import Lobby, {NAME as LOBBY_NAME} from "./lobby";
import * as game from "./game";
import * as result from "./result";
import interval from "./interval";

export default async function direct(io: SocketIO.Server): Promise<void> {
    let users = new Users();
    let sender = new Sender(io, { scene: LOBBY_NAME });
    let synchronizer = new Synchronizer(io, users, sender);
    while (true) {
        let numPlayers: number;
        {
            sender.send(LOBBY_NAME, {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
            let lobby = new Lobby(users);

            let onJoin = (socket: SocketIO.Socket, name: string) => {
                lobby.join(socket.id, name);
                sender.send(LOBBY_NAME, {
                    users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
                });
            };
            let onLeave = (socket: SocketIO.Socket) => {
                lobby.leave(socket.id);
                sender.send(LOBBY_NAME, {
                    users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
                });
            };
            synchronizer.on("join", onJoin);
            synchronizer.on("leave", onLeave);

            numPlayers = await new Promise<number>((resolve, reject) => {
                lobby.once("end", resolve);
            });
            synchronizer.removeListener("join", onJoin);
            synchronizer.removeListener("leave", onLeave);
        }

        let sockets = users.map(x => io.sockets.sockets[x.id]);
        let inputReceiver = new InputReceiver(sockets);

        sender.send(game.NAME, null);
        while (true) {
            let winner = await game.exec(numPlayers, inputReceiver, sender);
            sender.send("interval", {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
            if ((await interval(winner, users, sender)).finished) {
                break;
            }
        }
        inputReceiver.close();
        sender.send(result.NAME, null);
        await result.exec(synchronizer);
    }
}
