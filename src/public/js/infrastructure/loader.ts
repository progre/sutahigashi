import {RESOURCES as gameResource} from "../scene/game";
import {RESOURCES as resultResource} from "../scene/result";

export default function loadResources() {
    return new Promise<createjs.AbstractLoader>((resolve, reject) => {
        let loadQueue = new createjs.LoadQueue(false);
        loadQueue.on("complete", function onComplete() {
            loadQueue.off("complete", onComplete);
            resolve(loadQueue);
        });
        loadQueue.loadManifest(gameResource.concat(resultResource));
    });
}
