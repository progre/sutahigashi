import {Status} from "../../../domain/status";
import {VERSION} from "../../../domain/version";
import SE from "../infrastructure/se";
import Lobby from "./lobby";
import Game from "./game";
import Interval from "./interval";
import Result from "./result";

export default async function direct(socket: SocketIOClient.Socket, loader: createjs.AbstractLoader) {
    let stage = new createjs.Stage("canvas");
    let se = new SE();
    let scene = <Scene>{ name: "", close() { }, update(_: any) { } };
    socket.on("status", (status: Status) => {
        if (status.version !== VERSION) {
            window.location.reload(true);
        }
        if (status.scene !== scene.name) {
            scene.close();
            switch (name) {
                case "lobby": scene = new Lobby(loader, se, socket);
                case "game": scene = new Game(loader, stage, se, socket);
                case "interval": scene = new Interval(loader, se);
                case "result": scene = new Result(loader, se);
                default: throw new Error();
            }
        }
        scene.update((<any>status)[status.scene]);
    });
    socket.emit("getstatus");
}

interface Scene {
    name: string;
    close(): void;
    update(status: any): void;
}
