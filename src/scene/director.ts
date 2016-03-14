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
    main_loop: while (true) {
        if (winner != null && io.sockets.sockets[winner.id] == null) {
            winner = null;
        }
        let users = await lobby(roomReceiver, sender, winner);
        winner = null;
        let sockets = users.map(x => io.sockets.sockets[x.id]);
        while (true) {
            if (sockets.every(x => x.disconnected)) {
                continue main_loop;
            }
            let inputReceiver = new InputReceiver(sockets);
            let winner = await game(users.map(x => x.name), inputReceiver, sender);
            inputReceiver.close();
            let result = await interval(winner, users, sender);
            users = result.users;
            if (result.finished) {
                break;
            }
        }
        winner = users.concat().sort((a, b) => -(a.wins - b.wins))[0];
        await result(sender, users.findIndex(x => x === winner), winner);
        winner.wins = 0;
    }
}
