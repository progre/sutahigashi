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
    let element = React.createElement(View, { onJoin, onLeave });
    let container = createContainer();
    document.body.appendChild(container);
    ReactDOM.render(
        element,
        document.getElementById(container.id)
    );
    try {
        return await new Promise<any>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
                if (status.scene === "lobby") {
                    element.props.users = status.lobby.users;
                    return;
                }
                resolve(createScene(status.scene));
            });
            socket.emit("getstatus");
        });
    } finally {
        document.body.removeChild(container);
    }

    function onJoin(name: string) {
        socket.emit("join", name);
        console.log("join emitted");
    }

    function onLeave() {
        socket.emit("leave");
        console.log("leave emitted");
    }
}
