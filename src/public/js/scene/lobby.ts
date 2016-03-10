import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import createScene from "./scenefactory";
import View from "../component/lobby";
import {createContainer} from "../component/utils";

export default async function lobby(
    loader: createjs.AbstractLoader,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    let container = createContainer();
    document.getElementsByTagName("main")[0].appendChild(container);
    let component = ReactDOM.render(
        React.createElement(View, { onJoin, onLeave, loader }),
        document.getElementById(container.id)
    );
    try {
        return await new Promise<any>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
                if (status.scene === "lobby") {
                    component.setState({ users: status.lobby.users.map(x => x.name) });
                    return;
                }
                resolve(createScene(status.scene));
            });
            socket.emit("getstatus");
        });
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
