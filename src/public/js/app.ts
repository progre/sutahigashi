/// <reference path="../../../typings/browser.d.ts" />
import loadResource from "./infrastructure/loader";
import SE from "./infrastructure/se";
import {Scene} from "./scene/scene";
import createScene from "./scene/scenefactory";
import {Status} from "../../domain/status";
import {VERSION} from "../../domain/version";

async function main() {
    await new Promise((resolve, reject) => {
        window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
            window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
            resolve();
        });
    });
    let loader = await loadResource();
    let port = await (await fetch("./wsport")).text();

    let socket = io(`${location.hostname}:${port}`);
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
    });
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let se = new SE();
    let currentScene = await getCurrentScene(socket);
    while (true) {
        currentScene = await currentScene(loader, stage, se, socket);
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
