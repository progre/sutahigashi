/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import {createServer, IncomingMessage, ServerResponse} from "http";
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


let httpPort = process.argv[2] || 3000;
let wsPort = process.argv[3] || 3001;
let app = connect();
app.use("/wsport", (req: IncomingMessage, res: ServerResponse) => {
    res.end(wsPort);
});
app.use(serveStatic("./lib/public/"));
app.listen(httpPort);
let io = socket(wsPort);
direct(io).catch(e => console.error(e.stack));
logger.info(`Server started: ${httpPort} ${wsPort}`);
