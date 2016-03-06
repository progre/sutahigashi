import {getLogger} from "log4js";
let logger = getLogger();
import Sender from "../infrastructure/sender";
import {RoomReceiver, InputReceiver} from "../infrastructure/receiver";
import Users from "../domain/users";
import Lobby, {NAME as LOBBY_NAME} from "./lobby";
import game from "./game";
import interval from "./interval";
import result from "./result";

export default async function direct(io: SocketIO.Server): Promise<void> {
    let users = new Users();
    let sender = new Sender(io, { scene: LOBBY_NAME });
    io.on("connect", socket => {
        socket.on("getstatus", () => {
            try {
                socket.emit("status", sender.lastStatus);
            } catch (e) {
                logger.error(e.stack != null ? e.stack : e);
            }
        });
    });
    let roomReceiver = new RoomReceiver(io);
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
            roomReceiver.on("join", onJoin);
            roomReceiver.on("leave", onLeave);

            numPlayers = await new Promise<number>((resolve, reject) => {
                lobby.once("end", resolve);
            });
            roomReceiver.removeListener("join", onJoin);
            roomReceiver.removeListener("leave", onLeave);
        }

        let sockets = users.map(x => io.sockets.sockets[x.id]);
        while (true) {
            let inputReceiver = new InputReceiver(sockets);
            let winner = await game(numPlayers, inputReceiver, sender);
            inputReceiver.close();
            sender.send("interval", {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
            if ((await interval(winner, users, sender)).finished) {
                break;
            }
        }
        await result(sender);
    }
}
