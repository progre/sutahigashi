import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import createScene from "./scenefactory";
import View from "../component/lobby";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default async function lobby(
    loader: createjs.AbstractLoader,
    stage: createjs.Stage,
    se: SE,
    socket: SocketIOClient.Socket
) {
    let container = createContainer();
    document.getElementsByTagName("main")[0].appendChild(container);
    let component = ReactDOM.render(
        React.createElement(View, { loader, onJoin, onLeave }),
        document.getElementById(container.id)
    );
    try {
        let scene = await new Promise<string>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
                if (status.scene !== "lobby") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                component.setState({ users: status.lobby.users.map(x => x.name) });
            });
            socket.emit("getstatus");
        });
        se.play("lobby/bell");
        return createScene(scene);
    } finally {
        document.getElementsByTagName("main")[0].removeChild(container);
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
