import {Status} from "../../../domain/status";
import createScene from "./scenefactory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import View from "../component/interval";

export default async function lobby(
    loader: createjs.PreloadJS,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    ReactDOM.render(
        React.createElement(View, null),
        document.getElementById("interval")
    );

    return await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "interval") {
                return;
            }
            resolve(createScene(status.scene));
        });
        socket.emit("getstatus");
    });
}
