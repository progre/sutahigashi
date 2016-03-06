import {getLogger} from "log4js";
let logger = getLogger();
import Sender from "../infrastructure/sender";
import {RoomReceiver, InputReceiver} from "../infrastructure/receiver";
import {User} from "../domain/status";
import lobby, {NAME as LOBBY_NAME} from "./lobby";
import game from "./game";
import interval from "./interval";
import result from "./result";

export default async function direct(io: SocketIO.Server): Promise<void> {
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
    let winner: User;
    while (true) {
        let users = await lobby(roomReceiver, sender, winner);
        let sockets = users.map(x => io.sockets.sockets[x.id]);
        while (true) {
            let inputReceiver = new InputReceiver(sockets);
            let winner = await game(users.length, inputReceiver, sender);
            inputReceiver.close();
            let result = await interval(winner, users, sender);
            users = result.users;
            if (result.finished) {
                break;
            }
        }
        winner = users.sort((a, b) => -(a.wins - b.wins))[0];
        await result(sender, users.findIndex(x => x === winner), winner);
    }
}
