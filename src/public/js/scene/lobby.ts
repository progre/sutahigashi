import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status, User} from "../../../domain/status";
import createScene from "./scenefactory";
import View from "../component/lobby";
import {createContainer} from "../component/utils";

export default async function lobby(
    loader: createjs.PreloadJS,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    let container = createContainer();
    document.body.appendChild(container);
    ReactDOM.render(
        React.createElement(View, { onJoin, onLeave }),
        document.getElementById(container.id)
    );
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
        document.body.removeChild(container);
    }

    function onJoin(e: MouseEvent) {
        let input = <HTMLInputElement>document.getElementById("name");
        socket.emit("join", input.value);
        console.log("join emitted");
    }

    function onLeave(e: MouseEvent) {
        socket.emit("leave");
        console.log("leave emitted");
    }
}

function updateUsers(users: User[]) {
    (<HTMLTextAreaElement>document.getElementById("users"))
        .value = users.map(x => x.name).join("\n");
}
