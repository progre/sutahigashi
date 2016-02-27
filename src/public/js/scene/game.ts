import {Status} from "../../../domain/status";
import createField, {RESOURCES as fieldResources} from "../component/field";
import createScene from "./scenefactory";

export const RESOURCES = fieldResources;

export default async function game(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Game starting.");
    let field = createField(loadQueue);
    stage.addChild(field);
    stage.update();
    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "game") {
                return;
            }
            socket.off("status", onSocketStatus);
            resolve(createScene(status.scene));
        });
    });
    stage.removeChild(field);
    stage.update();
    console.log("Game finished.");
    return scene;
}
