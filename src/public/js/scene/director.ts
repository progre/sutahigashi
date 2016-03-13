import {Status} from "../../../domain/status";
import {VERSION} from "../../../domain/version";
import SE from "../infrastructure/se";
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
    let se = new SE();
    let status = await getStatus(socket);
    let scene = createScene(status.scene, loader, stage, se, socket);
    scene.update((<any>status)[status.scene]);
    socket.on("status", (status: Status) => {
        if (status.scene !== scene.name) {
            scene.close();
            scene = createScene(status.scene, loader, stage, se, socket);
        }
        scene.update((<any>status)[status.scene]);
    });
    socket.emit("getstatus");
}

function getStatus(socket: SocketIOClient.Socket) {
    return new Promise<Status>(resolve => {
        socket.once("status", (status: Status) => {
            resolve(status);
        });
        socket.emit("getstatus");
    });
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

interface Scene {
    name: string;
    close(): void;
    update(status: any): void;
}
