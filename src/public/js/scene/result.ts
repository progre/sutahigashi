import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View, {RESOURCES} from "../component/result";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export {RESOURCES};

export default class Result {
    private container = createContainer();

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
        console.log("Result starting.");
        return new Promise<string>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "result") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                se.play("result/winner");
                document.getElementsByTagName("main")[0].appendChild(this.container);
                ReactDOM.render(
                    React.createElement(View, {
                        loader,
                        number: status.result.number,
                        winner: status.result.winner.name
                    }),
                    this.container
                );
            };
            socket.on("status", onSocketStatus);
            socket.emit("getstatus");
        });
    }
}
