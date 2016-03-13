import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status, Lobby as LobbyStatus} from "../../../domain/status";
import View, {Props, State} from "../component/lobby";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Lobby {
    private container = createContainer();
    private component: React.Component<Props, State>;

    constructor(
        loader: createjs.AbstractLoader,
        private se: SE,
        sender: SocketIOClient.Socket
    ) {
        document.getElementsByTagName("main")[0].appendChild(this.container);
        this.component = ReactDOM.render<Props, State>(
            React.createElement(View, {
                loader,
                onJoin: (name: string) => {
                    sender.emit("join", name);
                    console.log("join emitted");
                },
                onLeave: () => {
                    sender.emit("leave");
                    console.log("leave emitted");
                }
            }),
            this.container
        );
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
        return new Promise<string>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "lobby") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                this.update(status.lobby);
            };
            socket.on("status", onSocketStatus);
            socket.emit("getstatus");
        });
    }

    update(status: LobbyStatus) {
        this.component.setState({ users: status.users.map(x => x.name) });
    }
}
