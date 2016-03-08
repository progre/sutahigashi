import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View from "../component/interval";
import {createContainer} from "../component/utils";
import createScene from "./scenefactory";

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
            document.getElementsByTagName("main")[0].appendChild(container);
            ReactDOM.render(
                React.createElement(View, status.interval),
                document.getElementById(container.id)
            );
        });
        socket.emit("getstatus");
    });
    document.getElementsByTagName("main")[0].removeChild(container);
    console.log("Interval finished.");
    return createScene(scene);
}
