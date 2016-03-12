/// <reference path="../../../typings/browser.d.ts" />
import loadResource from "./infrastructure/loader";
import direct from "./scene/director";

let loadPromise = new Promise((resolve, reject) => {
    window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
        window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
        resolve();
    });
});

async function main() {
    let [port, loader] = await Promise.all([
        (await fetch("./wsport")).text(),
        (async () => {
            await loadPromise;
            return await loadResource();
        })()
    ]);
    await direct(io(`${location.hostname}:${port}`), loader);
}

main().catch(e => {
    console.error(e);
    throw e;
});
