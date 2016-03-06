import {getLogger} from "log4js";
let logger = getLogger();
import Sender from "../infrastructure/sender";
import {RoomReceiver, InputReceiver} from "../infrastructure/receiver";
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
    while (true) {
        let users = await lobby(roomReceiver, sender);
        let sockets = users.map(x => io.sockets.sockets[x.id]);
        while (true) {
            let inputReceiver = new InputReceiver(sockets);
            let winner = await game(users.length, inputReceiver, sender);
            inputReceiver.close();
            if ((await interval(winner, users, sender)).finished) {
                break;
            }
        }
        await result(sender);
    }
}
