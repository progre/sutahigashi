import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import Lobby, {NAME as LOBBY_NAME} from "./lobby";
import * as game from "./game";
import * as result from "./result";
import interval from "./interval";

export default async function direct(io: SocketIO.Server): Promise<void> {
    let users = new Users();
    let synchronizer = new Synchronizer(io, users);
    while (true) {
        let numPlayers: number;
        {
            synchronizer.startScene(LOBBY_NAME, {
                users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
            });
            let lobby = new Lobby(users);

            let onJoin = (socket: SocketIO.Socket, name: string) => {
                lobby.join(socket.id, name);
                synchronizer.postScene(LOBBY_NAME, {
                    users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
                });
            };
            let onLeave = (socket: SocketIO.Socket) => {
                lobby.leave(socket.id);
                synchronizer.postScene(LOBBY_NAME, {
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


        synchronizer.startScene(game.NAME, null);
        while (true) {
            let winner = await game.exec(numPlayers, synchronizer);
            if ((await interval(winner, users, synchronizer)).finished) {
                break;
            }
        }
        synchronizer.startScene(result.NAME, null);
        await result.exec(synchronizer);
    }
}
