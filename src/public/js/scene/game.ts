import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status} from "../../../domain/status";
import {FPS} from "../../../domain/game/definition";
import EventDetector from "../domain/eventdetector";
import Controller from "../infrastructure/controller";
import SE from "../infrastructure/se";
import GameSub from "../component/gamesub";
import {createContainer} from "../component/utils";
import World, {RESOURCES} from "../component/game/world";

export {RESOURCES};

export default class Game {
    private controller = new Controller();
    private world: World;
    private subContainer = createContainer();
    private onUpdateTimer: NodeJS.Timer;

    constructor(
        private stage: createjs.Stage,
        private se: SE) {
    }

    close() {
        this.se.game.playGameSet();
        clearInterval(this.onUpdateTimer);
        this.stage.removeChild(this.world);
        this.stage.update();
        this.controller.release();
        document.getElementsByTagName("main")[0].removeChild(this.subContainer);
        console.log("Game finished.");
    }

    exec(
        loader: createjs.AbstractLoader,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ) {
        console.log("Game starting.");
        document.getElementsByTagName("main")[0].appendChild(this.subContainer);
        let subViewRendered = false;

        this.world = new World(loader, <HTMLCanvasElement>stage.canvas);
        stage.addChild(this.world);
        stage.update();

        const wait = 10;
        let tick = 0;
        let sendingTick = 0;
        let waiting = 0;
        this.onUpdateTimer = setInterval(() => {
            if (sendingTick > tick + wait) {
                // 入力が先行しすぎないようにする
                waiting++;
                return;
            }
            if (waiting > 0) {
                console.log(`Input waited caused by server lated: ${waiting} frame(s)`);
                waiting = 0;
            }
            socket.emit("input", this.controller.popStatus());
            sendingTick++;
        }, 1000 / FPS);

        let eventDetector = new EventDetector();
        eventDetector.on("put", () => {
            se.game.play("basic/put");
        });
        eventDetector.on("explosion", () => {
            console.log("exp");
            se.game.play("basic/explosion");
        });
        eventDetector.on("death", () => {
            se.game.play("basic/death");
        });
        return new Promise<any>((resolve, reject) => {
            let onSocketStatus = (status: Status) => {
                if (status.scene !== "game") {
                    socket.off("status", onSocketStatus);
                    resolve(status.scene);
                    return;
                }
                if (!subViewRendered) {
                    ReactDOM.render(
                        React.createElement(GameSub, { loader, users: status.game.players.map(x => x.name) }),
                        this.subContainer
                    );
                    subViewRendered = true;
                }
                tick = status.game.tick;
                this.world.render(status.game);
                stage.update();
                eventDetector.update(status.game);
            };
            socket.on("status", onSocketStatus);
        });
    }
}
