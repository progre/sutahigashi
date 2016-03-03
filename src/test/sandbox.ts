// /// <reference path="../../typings/test.d.ts" />
// import assert from "power-assert";
// import * as SocketIOStatic from "socket.io";
// const socket: SocketIOStatic = require("socket.io");
// const getPort = <() => Promise<number>>require("native-promisify")(require("getport"));
// import {connect} from "socket.io-client";

// describe("socket.io", () => {
//     it("is usual", async function() {
//         this.timeout(10 * 1000);
//         let port = await getPort();
//         let io = socket(port);
//         return new Promise((resolve, reject) => {
//             io.on("connect", socket => {
//                 console.log("hoge")
//                 socket.on("ping", () => {
//                     console.log("sc")
//                     resolve();
//                 });
//             });
//             let client = connect(`http://127.0.0.1:${port}`, { forceNew: true });
//             client.on("connect", () => {
//                 setInterval(() => client.emit("ping"), 1000);
//             });
//             assert.ok(client);
//         });
//     });
// });
