/// <reference path="../../typings/test.d.ts" />
const getPort = <() => Promise<number>>require("native-promisify")(require("getport"));
import {fork} from "child_process";
import assert from "power-assert";

describe("Server", () => {
    it("is runnable", async function() {
        this.timeout(5000);
        let httpPort = (await getPort()).toString();
        let wsPort = (await getPort()).toString();
        let started = `[????-??-?? ??:??:??.???] [INFO] [default] - Server started. ${httpPort} ${wsPort}\n`;
        const LOG_HEADER_PATTERN = /\[.+\] \[.+\] \[.+\] - /;
        return new Promise((resolve, reject) => {
            let server = fork(".", [httpPort, wsPort], { silent: true });
            server.on("exit", onExit);
            server.on("error", onError);
            server.stdout.on("readable", () => {
                let log = server.stdout.read(started.length);
                if (log == null) {
                    return;
                }
                try {
                    assert.equal(log.toString().replace(LOG_HEADER_PATTERN, ""), started.replace(LOG_HEADER_PATTERN, ""));
                } catch (err) {
                    onError(err);
                    return;
                }
                server.kill("SIGINT");
            });

            function onExit() {
                server.removeListener("exit", onExit);
                server.removeListener("error", onError);
                resolve();
            }

            function onError(err: any) {
                server.removeListener("exit", onExit);
                server.removeListener("error", onError);
                reject(err);
            }
        });
    });
});
