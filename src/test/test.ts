/// <reference path="../../typings/DefinitelyTyped/mocha/mocha.d.ts" />
/// <reference path="../../typings/DefinitelyTyped/power-assert/power-assert.d.ts" />
/// <reference path="../../typings/main.d.ts" />
const getPort = <() => Promise<number>>require("native-promisify")(require("getport"));
import {fork} from "child_process";
import assert from "power-assert";

describe("Server", () => {
    it("is runnable", async function() {
        this.timeout(5000);
        let port = await getPort();
        return new Promise((resolve, reject) => {
            let server = fork(".", [port.toString()], { silent: true });
            server.on("exit", onExit);
            server.on("error", onError);
            server.stdout.on("readable", () => {
                const STARTED = "[????-??-?? ??:??:??.???] [INFO] [default] - Server started.\n";
                const LOG_HEADER_PATTERN = /\[.+\] \[.+\] \[.+\] - /;
                let log = server.stdout.read(STARTED.length);
                if (log == null) {
                    return;
                }
                try {
                    assert.equal(log.toString().replace(LOG_HEADER_PATTERN, ""), STARTED.replace(LOG_HEADER_PATTERN, ""));
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
