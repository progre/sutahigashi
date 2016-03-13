import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status, Interval as IntervalStatus} from "../../../domain/status";
import View from "../component/interval";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Interval {
    private container = createContainer();

    constructor(
        private loader: createjs.AbstractLoader,
        private se: SE
    ) {
        console.log("Interval starting.");
    }

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
        return new Promise<string>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "interval") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                this.update(status.interval);
            };
            socket.on("status", onSocketStatus);
            socket.emit("getstatus");
        });
    }

    update(status: IntervalStatus) {
        if (status.winner != null) {
            this.se.play("interval/crown");
        } else {
            this.se.play("interval/draw");
        }
        document.getElementsByTagName("main")[0].appendChild(this.container);
        let props = {
            loader: this.loader,
            users: status.users.map((x, i) => ({
                name: x.name,
                wins: x.wins
            })),
            winner: status.winner
        };
        ReactDOM.render(
            React.createElement(View, props),
            this.container
        );
    }
}
