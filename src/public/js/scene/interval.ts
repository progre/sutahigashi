import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View from "../component/interval";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Interval {
    close() {
    }

    async exec(
        loader: createjs.AbstractLoader,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ) {
        console.log("Interval starting.");
        let container = createContainer();
        let sceneName = await new Promise<string>((resolve, reject) => {
            socket.on("status", function onSocketStatus(status: Status) {
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
                document.getElementsByTagName("main")[0].appendChild(container);
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
                    document.getElementById(container.id)
                );
            });
            socket.emit("getstatus");
        });
        document.getElementsByTagName("main")[0].removeChild(container);
        console.log("Interval finished.");
        return sceneName;
    }
}
