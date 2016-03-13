import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status, Result as ResultStatus} from "../../../domain/status";
import View, {RESOURCES} from "../component/result";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export {RESOURCES};

export default class Result {
    private container = createContainer();

    constructor(
        private loader: createjs.AbstractLoader,
        private se: SE
    ) {
        console.log("Result starting.");
    }

    close() {
        document.getElementsByTagName("main")[0].removeChild(this.container);
        console.log("Result finished.");
    }

    exec(
        loader: createjs.AbstractLoader,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ) {
        return new Promise<string>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "result") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                this.update(status.result);
            };
            socket.on("status", onSocketStatus);
            socket.emit("getstatus");
        });
    }

    update(status: ResultStatus) {
        this.se.play("result/winner");
        document.getElementsByTagName("main")[0].appendChild(this.container);
        ReactDOM.render(
            React.createElement(View, {
                loader: this.loader,
                number: status.number,
                winner: status.winner.name
            }),
            this.container
        );
    }
}
