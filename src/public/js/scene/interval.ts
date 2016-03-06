import {Status} from "../../../domain/status";
import createScene from "./scenefactory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import View from "../component/interval";
import {createContainer} from "../component/utils";

export default async function lobby(
    loader: createjs.PreloadJS,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Interval starting.");
    let container = createContainer();
    let scene = await new Promise<string>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene !== "interval") {
                socket.off("status", onSocketStatus);
                resolve(status.scene);
                return;
            }
            document.body.appendChild(container);
            ReactDOM.render(
                React.createElement(View, {
                    users: status.users
                }),
                document.getElementById(container.id)
            );
        });
        socket.emit("getstatus");
    });
    document.body.removeChild(container);
    console.log("Interval finished.");
    return createScene(scene);
}
