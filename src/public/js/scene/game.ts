import * as React from "react";
import * as ReactDOM from "react-dom";
import * as clone from "clone";
import {Game as Status, Player} from "../../../domain/status";
import {FPS} from "../../../domain/game/definition";
import {Input} from "../../../domain/game/input";
import * as objects from "../../../domain/game/objects";
import * as players from "../../../domain/game/players";
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
    private firstRendered = false;
    private showingTick = 0;
    private sendings = <Input[]>[null]; // 最初のtickは入力なし
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
            })
            .on("gameset", () => {
                se.game.playGameSet();
            });
    }

    close() {
        clearInterval(this.onUpdateTimer);
        this.stage.removeChild(this.world);
        this.stage.update();
        this.controller.release();
        document.getElementsByTagName("main")[0].removeChild(this.subContainer);
        console.log("Game finished.");
    }

    update(status: Status) {
        if (!this.firstRendered) {
            this.initView(status);
            this.firstRendered = true;
        }
        let player = status.players.find(x => x.id === `/#${this.sender.id}`);
        this.showingTick = status.tick;
        this.eventDetector.update(clone(status));
        this.updateMyMove(player, status);
        this.world.render(status);
        this.stage.update();
    }

    private initView(status: Status) {
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
    }

    private tick() {
        if (this.sendings.length > this.showingTick + wait) {
            // 入力が先行しすぎないようにする
            this.waiting++;
            return;
        }
        if (this.waiting > 0) {
            console.log(`Input waited caused by server lated: ${this.waiting} frame(s)`);
            this.waiting = 0;
        }
        let input = this.controller.popStatus();
        this.sender.emit("input", input);
        this.sendings.push(input);
    }

    private updateMyMove(player: Player, status: Status) {
        if (player == null) {
            return;
        }
        for (let input of this.sendings.concat().splice(status.tick + 1)) {
            objects.movePlayer(
                input,
                player.point,
                status.lands,
                status.overlays,
                players.getBombs(status.players));
            objects.putBomb(player, input);
        }
    }
}
