import * as React from "react";
import * as ReactDOM from "react-dom";
import {Status, Game} from "../../../domain/status";
import {FPS} from "../../../domain/game/definition";
import EventDetector from "../domain/eventdetector";
import Controller from "../infrastructure/controller";
import SE from "../infrastructure/se";
import GameSub from "../component/gamesub";
import {createContainer} from "../component/utils";
import World, {RESOURCES} from "../component/game/world";
import createScene from "./scenefactory";

export {RESOURCES};

export default async function game(
    loader: createjs.LoadQueue,
    stage: createjs.Stage,
    se: SE,
    socket: SocketIOClient.Socket
) {
    console.log("Game starting.");
    let subContainer = createContainer();
    let main = document.getElementsByTagName("main")[0];
    main.appendChild(subContainer);
    let subViewRendered = false;

    let controller = new Controller();
    let world = new World(loader, <HTMLCanvasElement>stage.canvas);
    stage.addChild(world);
    stage.update();

    const wait = 10;
    let tick = 0;
    let sendingTick = 0;
    let waiting = 0;
    let onUpdateTimer = setInterval(() => {
        if (sendingTick > tick + wait) {
            // 入力が先行しすぎないようにする
            waiting++;
            return;
        }
        if (waiting > 0) {
            console.log(`Input waited caused by server lated: ${waiting} frame(s)`);
            waiting = 0;
        }
        socket.emit("input", controller.popStatus());
        sendingTick++;
    }, 1000 / FPS);

    let eventDetector = new EventDetector();
    eventDetector.on("put", () => {
        se.play("game/basic/put");
    });
    eventDetector.on("explosion", () => {
        console.log("exp");
        se.play("game/basic/explosion");
    });
    eventDetector.on("death", () => {
        se.play("game/basic/death");
    });
    let scene = await new Promise<any>((resolve, reject) => {
        socket.on("status", function onSocketStatus(status: Status) {
            if (status.scene !== "game") {
                socket.off("status", onSocketStatus);
                resolve(createScene(status.scene));
                return;
            }
            if (!subViewRendered) {
                ReactDOM.render(
                    React.createElement(GameSub, { loader, users: status.game.players.map(x => x.name) }),
                    document.getElementById(subContainer.id)
                );
                subViewRendered = true;
            }
            tick = status.game.tick;
            world.render(status.game);
            stage.update();
            eventDetector.update(status.game);
        });
    });
    se.playGameSet();
    clearInterval(onUpdateTimer);
    stage.removeChild(world);
    stage.update();
    controller.release();
    main.removeChild(subContainer);
    console.log("Game finished.");
    return scene;
}
