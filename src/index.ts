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

function main() {
    let users = new Users();
    let io = socket(8000);
    io.on("connection", socket => {
        logger.debug("connected");

        socket.on("disconnect", () => {
            logger.debug("disconnected");
            let user = users.tryLeave(socket);
            if (user != null) {
                onLeaved(io, users, user);
            }
        });

        socket.on("get users", () => {
            emitUsers(socket, users);
        });

        socket.on("join", (name: string) => {
            let user = { socket, name };
            try {
                users.join(user);
                emitUsers(io, users);
                logger.info(`${userToString(user)} joined. (users: ${users.length})`);
            } catch (e) {
                logger.error(`${e.message}: ${userToString(user)}`);
            }
        });

        socket.on("leave", () => {
            try {
                let user = users.leave(socket);
                onLeaved(io, users, user);
            } catch (e) {
                logger.error(`${e.message}: ${socket.client.conn.remoteAddress}`);
            }
        });
    });

    logger.info("Server started.");
}

function onLeaved(io: SocketIO.Server, users: Users, leavedUser: User) {
    emitUsers(io, users);
    logger.info(`${userToString(leavedUser)} leaved. (users: ${users.length})`);
}

function emitUsers(emitter: Emitable, users: Users) {
    emitter.emit("users", users.map(x => ({ name: x.name })));
}

function userToString(user: User) {
    return `${user.name}@${user.socket.client.conn.remoteAddress}`;
}

interface Emitable {
    emit(event: string, ...args: any[]): any;
}

interface User {
    name: string;
    socket: SocketIO.Socket;
}

main();
