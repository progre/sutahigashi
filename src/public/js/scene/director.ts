import {Status} from "../../../domain/status";
import {VERSION} from "../../../domain/version";
import SE from "../infrastructure/se";
import {Scene} from "./scene";
import createScene from "./scenefactory";

export default async function direct(socket: SocketIOClient.Socket, loader: createjs.AbstractLoader) {
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
    });
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let se = new SE();
    let scene = await getCurrentScene(socket, stage, se);
    while (true) {
        let sceneName = await scene.exec(loader, stage, se, socket);
        scene.close();
        console.log(sceneName);
        scene = createScene(sceneName, stage, se);
    }
}

async function getCurrentScene(socket: SocketIOClient.Socket, stage: createjs.Stage, se: SE): Promise<Scene> {
    let status = await new Promise<Status>((resolve, reject) => {
        socket.once("status", (status: Status) => {
            resolve(status);
        });
        socket.emit("getstatus");
    });
    return createScene(status.scene, stage, se);
}
