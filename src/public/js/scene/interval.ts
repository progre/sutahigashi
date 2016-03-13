import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View from "../component/interval";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Interval {
    private container = createContainer();

    close() {
        document.getElementsByTagName("main")[0].removeChild(this.container);
        console.log("Interval finished.");
    }

    exec(
        loader: createjs.AbstractLoader,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ) {
        console.log("Interval starting.");
        return new Promise<string>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "interval") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                if (status.interval.winner != null) {
                    se.play("interval/crown");
                } else {
                    se.play("interval/draw");
                }
                document.getElementsByTagName("main")[0].appendChild(this.container);
                let props = {
                    loader,
                    users: status.interval.users.map((x, i) => ({
                        name: x.name,
                        wins: x.wins
                    })),
                    winner: status.interval.winner
                };
                ReactDOM.render(
                    React.createElement(View, props),
                    this.container
                );
            };
            socket.on("status", onSocketStatus);
            socket.emit("getstatus");
        });
    }
}
