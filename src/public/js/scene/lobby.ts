import {Status, User} from "../../../domain/status";
import createScene from "./scenefactory";

export default async function lobby(
    loader: createjs.PreloadJS,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    document.getElementById("join").addEventListener("click", onJoinClick);
    document.getElementById("leave").addEventListener("click", onLeaveClick);
    try {
        return await new Promise<any>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
                if (status.scene === "lobby") {
                    updateUsers(status.lobby.users);
                    return;
                }
                resolve(createScene(status.scene));
            });
            socket.emit("getstatus");
        });
    } finally {
        document.getElementById("join").removeEventListener("click", onJoinClick);
        document.getElementById("leave").removeEventListener("click", onLeaveClick);
    }

    function onJoinClick(e: MouseEvent) {
        let input = <HTMLInputElement>document.getElementById("name");
        socket.emit("join", input.value);
        console.log("join emitted");
    }

    function onLeaveClick(e: MouseEvent) {
        socket.emit("leave");
        console.log("leave emitted");
    }
}

function updateUsers(users: User[]) {
    (<HTMLTextAreaElement>document.getElementById("users"))
        .value = users.map(x => x.name).join("\n");
}
