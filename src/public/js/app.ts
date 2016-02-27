/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import lobby from "./scene/lobby";
import {Status} from "../../domain/status";
import {VERSION} from "../../domain/version";

async function main() {
    let socket = io(location.hostname + ":8000/");
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
    });
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let currentScene = await getCurrentScene();
    while (true) {
        currentScene = await currentScene(stage, socket);
    }
}

function getCurrentScene(): Promise<Scene> {
    // サーバーに問い合わせる
    return Promise.resolve(lobby);
}

interface Scene {
    (stage: createjs.Stage, socket: SocketIOClient.Socket): Promise<Scene>;
}

window.addEventListener("DOMContentLoaded", () => {
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
