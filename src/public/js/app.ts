/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import * as lobby from "./scene/lobby";

async function main() {
    let socket = io(location.hostname + ":8000/");
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let currentScene = await getCurrentScene();
    while (true) {
        currentScene = await currentScene.show(stage, socket);
    }
}

async function getCurrentScene(): Promise<Scene> {
    // サーバーに問い合わせる
    return lobby;
}

interface Scene {
    show(stage: createjs.Stage, socket: SocketIOClient.Socket): Scene;
}

window.addEventListener("DOMContentLoaded", () => {
    main().catch(e => e.stack != null ? e.stack : e);
});
