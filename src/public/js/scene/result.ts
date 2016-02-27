import {Status} from "../../../domain/status";
import createScene from "./scenefactory";

export const RESOURCES = [{
    id: "result", src: "res/result.png"
}];

export default async function result(
    loadQueue: createjs.LoadQueue,
    stage: createjs.Stage,
    socket: SocketIOClient.Socket
) {
    console.log("Result starting.");
    let bg = new createjs.Bitmap(<any>loadQueue.getResult("result"));
    stage.addChild(bg);
    stage.update();
    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene === "result") {
                return;
            }
            socket.off("status", onSocketStatus);
            resolve(createScene(status.scene));
        });
    });
    stage.removeChild(bg);
    stage.update();
    console.log("Result finished.");
    return scene;
}
