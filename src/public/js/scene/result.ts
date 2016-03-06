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
    // let bg = new createjs.Bitmap(<any>loadQueue.getResult("result"));
    // stage.addChild(bg);
    // stage.update();
    // let scene = await new Promise<any>((resolve, reject) => {
    //     socket.on("status", function onSocketStatus(status: Status) {
    //         if (status.scene === "result") {
    //             return;
    //         }
    //         socket.off("status", onSocketStatus);
    //         resolve(createScene(status.scene));
    //     });
    // });
    // stage.removeChild(bg);
    // stage.update();
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
                React.createElement(View, status.result),
                document.getElementById(container.id)
            );
        });
        socket.emit("getstatus");
    });
    document.body.removeChild(container);
    console.log("Result finished.");
    return createScene(scene);
}
