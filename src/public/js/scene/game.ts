import * as React from "react";
import * as ReactDOM from "react-dom";
import {Game as Status} from "../../../domain/status";
import {FPS} from "../../../domain/game/definition";
import EventDetector from "../domain/eventdetector";
import Controller from "../infrastructure/controller";
import SE from "../infrastructure/se";
import GameSub from "../component/gamesub";
import {createContainer} from "../component/utils";
import World, {RESOURCES} from "../component/game/world";

export {RESOURCES};

const wait = 10;

export default class Game {
    name: "game" = "game";

    private controller = new Controller();
    private eventDetector = new EventDetector();
    private subContainer = createContainer();
    private world: World;
    private subViewRendered = false;
    private showingTick = 0;
    private sendingTick = 0;
    private waiting = 0;
    private onUpdateTimer = setInterval(
        () => this.tick(),
        1000 / FPS);

    constructor(
        private loader: createjs.AbstractLoader,
        private stage: createjs.Stage,
        private se: SE,
        private sender: SocketIOClient.Socket
    ) {
        console.log("Game starting.");
        document.getElementsByTagName("main")[0].appendChild(this.subContainer);

        this.eventDetector
            .on("put", () => {
                se.game.play("basic/put");
            })
            .on("explosion", () => {
                se.game.play("basic/explosion");
            })
            .on("death", () => {
                se.game.play("basic/death");
            })
            .on("pickup", () => {
                se.game.play("basic/pickup");
            });
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

    update(status: Status) {
        if (!this.subViewRendered) {
            this.world = new World(
                this.loader,
                <HTMLCanvasElement>this.stage.canvas,
                status.lands);
            this.stage.addChild(this.world);
            ReactDOM.render(
                React.createElement(GameSub, {
                    loader: this.loader,
                    users: status.players.map(x => x.name)
                }),
                this.subContainer
            );
            this.subViewRendered = true;
        }
        this.showingTick = status.tick;
        this.world.render(status);
        this.stage.update();
        this.eventDetector.update(status);
    }

    private tick() {
        if (this.sendingTick > this.showingTick + wait) {
            // 入力が先行しすぎないようにする
            this.waiting++;
            return;
        }
        if (this.waiting > 0) {
            console.log(`Input waited caused by server lated: ${this.waiting} frame(s)`);
            this.waiting = 0;
        }
        this.sender.emit("input", this.controller.popStatus());
        this.sendingTick++;
    }
}
