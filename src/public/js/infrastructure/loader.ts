import {RESOURCES as gameResources} from "../scene/game";
import {RESOURCES as resultResources} from "../scene/result";
import {RESOURCES as seResources} from "./se";

export default function loadResources() {
    return new Promise<createjs.AbstractLoader>((resolve, reject) => {
        let loadQueue = new createjs.LoadQueue(false);
        loadQueue.installPlugin(<any>createjs.Sound);
        loadQueue.on("complete", function onComplete() {
            loadQueue.off("complete", onComplete);
            resolve(loadQueue);
        });
        loadQueue.loadManifest(
            gameResources
                .concat(resultResources)
                .concat(seResources));
    });
}
