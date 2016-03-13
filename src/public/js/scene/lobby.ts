import * as React from "react";
import * as ReactDOM from "react-dom";
import {Lobby as Status} from "../../../domain/status";
import View, {Props, State} from "../component/lobby";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Lobby {
    name: "lobby" = "lobby";

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

    update(status: Status) {
        this.component.setState({ users: status.users.map(x => x.name) });
    }
}
