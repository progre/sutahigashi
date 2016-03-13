import {Status} from "../../../domain/status";
import {VERSION} from "../../../domain/version";
import SE from "../infrastructure/se";
import {Scene} from "./scene";
import Lobby from "./lobby";
import Game from "./game";
import Interval from "./interval";
import Result from "./result";

export default async function direct(socket: SocketIOClient.Socket, loader: createjs.AbstractLoader) {
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
    });
    let stage = new createjs.Stage("canvas");
    // 今のステートを調べる
    let se = new SE();
    let scene = await getCurrentScene(loader, socket, stage, se);
    while (true) {
        let sceneName = await scene.exec(loader, stage, se, socket);
        scene.close();
        console.log(sceneName);
        scene = createScene(sceneName, loader, stage, se, socket);
    }
}

async function getCurrentScene(
    loader: createjs.AbstractLoader,
    socket: SocketIOClient.Socket,
    stage: createjs.Stage,
    se: SE
) {
    let status = await new Promise<Status>((resolve, reject) => {
        socket.once("status", (status: Status) => {
            resolve(status);
        });
        socket.emit("getstatus");
    });
    return createScene(status.scene, loader, stage, se, socket);
}

function createScene(
    name: string,
    loader: createjs.AbstractLoader,
    stage: createjs.Stage,
    se: SE,
    sender: SocketIOClient.Socket
): Scene {
    switch (name) {
        case "lobby": return new Lobby(loader, se, sender);
        case "game": return new Game(loader, stage, se, sender);
        case "interval": return new Interval(loader, se);
        case "result": return new Result(loader, se);
        default: throw new Error();
    }
}
