import SE from "../infrastructure/se";
import Lobby from "./lobby";
import Game from "./game";
import Interval from "./interval";
import Result from "./result";

export default function createScene(name: string, stage: createjs.Stage, se: SE): any {
    switch (name) {
        case "lobby": return new Lobby(se);
        case "game": return new Game(stage, se);
        case "interval": return new Interval();
        case "result": return new Result();
        default: throw new Error();
    }
}
