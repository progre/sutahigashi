import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View from "../component/result";
import {createContainer} from "../component/utils";
import createScene from "./scenefactory";

export const RESOURCES = [{
    id: "result", src: "res/result.png"
}];

export default async function result(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Result starting.");
    let container = createContainer();
    let scene = await new Promise<string>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene !== "result") {
                socket.off("status", onSocketStatus);
                resolve(status.scene);
                return;
            }
            document.body.appendChild(container);
            ReactDOM.render(
                React.createElement(View, {
                    number: status.result.number,
                    winner: status.result.winner.name
                }),
                document.getElementById(container.id)
            );
        });
        socket.emit("getstatus");
    });
    document.body.removeChild(container);
    console.log("Result finished.");
    return createScene(scene);
}
