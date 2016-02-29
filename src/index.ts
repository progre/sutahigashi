/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import {createServer} from "http";
import * as connect from "connect";
import * as serveStatic from "serve-static";
import * as SocketIOStatic from "socket.io";
const socket: SocketIOStatic = require("socket.io");
import {configure, getLogger} from "log4js";
configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});
let logger = getLogger();
import direct from "./scene/director";


let app = connect();
app.use(serveStatic("./lib/public/"));
let server = createServer(app);
let io = socket(server);
server.listen(3000);
logger.info("Server started.");
direct(io).catch(e => console.error(e.stack));
