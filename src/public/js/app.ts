/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Lobby from "./component/lobby";
import {Scene} from "./scene/scene";
import createScene from "./scene/scenefactory";
import {RESOURCES as gameResource} from "./scene/game";
import {RESOURCES as resultResource} from "./scene/result";
import {Status} from "../../domain/status";
import {VERSION} from "../../domain/version";

async function main() {
    await new Promise((resolve, reject) => {
        window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
            window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
            resolve();
        });
    });
    let loadQueue = new createjs.LoadQueue(false);
    await new Promise((resolve, reject) => {
        loadQueue.on("complete", function onComplete() {
            loadQueue.off("complete", onComplete);
            resolve(loadQueue);
        });
        loadQueue.loadManifest(gameResource.concat(resultResource));
    });
    let port = (await fetch("./websocketport")).text();

    ReactDOM.render(
        React.createElement(Lobby, null),
        document.getElementById("lobby")
    );

    let socket = io(`${location.hostname}:${port}`);
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
    });
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let currentScene = await getCurrentScene(socket);
    while (true) {
        currentScene = await currentScene(loadQueue, stage, socket);
    }
}

async function getCurrentScene(socket: SocketIOClient.Socket): Promise<Scene> {
    let status = await new Promise<Status>((resolve, reject) => {
        socket.once("status", (status: Status) => {
            resolve(status);
        });
        socket.emit("getstatus");
    });
    return createScene(status.scene);
}

main().catch(e => {
    console.error(e);
    throw e;
});
