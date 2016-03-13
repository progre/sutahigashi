import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View from "../component/lobby";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Lobby {
    private container = createContainer();

    constructor(
        private se: SE
    ) {
    }

    close() {
        this.se.play("lobby/bell");
        document.getElementsByTagName("main")[0].removeChild(this.container);
    }

    exec(
        loader: createjs.AbstractLoader,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ) {
        document.getElementsByTagName("main")[0].appendChild(this.container);
        let component = ReactDOM.render(
            React.createElement(View, { loader, onJoin, onLeave }),
            this.container
        );
        return new Promise<string>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
                console.log(status);
                if (status.scene !== "lobby") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                component.setState({ users: status.lobby.users.map(x => x.name) });
            });
            socket.emit("getstatus");
        });

        function onJoin(name: string) {
            socket.emit("join", name);
            console.log("join emitted");
        }

        function onLeave() {
            socket.emit("leave");
            console.log("leave emitted");
        }
    }
}
