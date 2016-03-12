import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import View, {RESOURCES} from "../component/result";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";
import createScene from "./scenefactory";

export {RESOURCES};

export default async function result(
    loader: createjs.LoadQueue,
    stage: createjs.Stage,
    se: SE,
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
            se.play("result/winner");
            document.getElementsByTagName("main")[0].appendChild(container);
            ReactDOM.render(
                React.createElement(View, {
                    loader,
                    number: status.result.number,
                    winner: status.result.winner.name
                }),
                document.getElementById(container.id)
            );
        });
        socket.emit("getstatus");
    });
    document.getElementsByTagName("main")[0].removeChild(container);
    console.log("Result finished.");
    return createScene(scene);
}
