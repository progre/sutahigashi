import {Status} from "../../../domain/status";
import lobby from "./lobby";

export default function game(stage: createjs.Stage, socket: SocketIOClient.Socket) {
    console.log("Game starting.");
    return new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "game") {
                return;
            }
            socket.off("status", onSocketStatus);
            console.log("Game finished.");
            resolve(lobby);
        });
    });
}
