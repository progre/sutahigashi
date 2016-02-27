/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as SocketIOStatic from "socket.io";
const socket: SocketIOStatic = require("socket.io");
import {configure, getLogger} from "log4js";
configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});
let logger = getLogger();
import Users from "./domain/users";
import Synchronizer from "./infrastructure/synchronizer";
import {Scene} from "./scene/scene";
import * as lobby from "./scene/lobby";

async function main() {
    let scene: Scene = lobby;
    let users = new Users();
    let io = socket(8000);
    let synchronizer = new Synchronizer(io, users);
    // どのシーンでもユーザーの出入りはある
    io.on("connection", socket => {
        logger.debug("connected");

        socket.on("disconnect", () => {
            logger.debug("disconnected");
            users.tryLeave(socket);
        });

        socket.on("get status", () => {
            synchronizer.postSceneToUser(socket, scene.NAME);
        });

        socket.on("join", (name: string) => {
            users.tryJoin({ socket, name });
        });

        socket.on("leave", () => {
            users.tryLeave(socket);
        });
    });

    logger.info("Server started.");
    while (true) {
        scene = await scene.exec(synchronizer, users);
    }
}

main();
