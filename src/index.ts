/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as SocketIOStatic from "socket.io";
const socket: SocketIOStatic = require("socket.io");
import {configure, getLogger} from "log4js";
configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});
let logger = getLogger();

import Synchronizer from "./infrastructure/synchronizer";
import {Scene} from "./scene/scene";
import * as lobby from "./scene/lobby";

async function main() {
    let scene: Scene = lobby;
    let synchronizer = new Synchronizer(socket(8000));
    logger.info("Server started.");
    while (true) {
        synchronizer.startScene(scene.NAME);
        scene = await scene.exec(synchronizer);
    }
}

main();
