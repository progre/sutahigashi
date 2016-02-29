/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as SocketIOStatic from "socket.io";
const socket: SocketIOStatic = require("socket.io");
import {configure, getLogger} from "log4js";
configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});
let logger = getLogger();
import direct from "./scene/director";

logger.info("Server started.");
direct(socket(8000)).catch(e => console.error(e.stack));
