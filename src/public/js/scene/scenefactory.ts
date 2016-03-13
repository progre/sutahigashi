import Lobby from "./lobby";
import Game from "./game";
import Interval from "./interval";
import Result from "./result";

export default function createScene(name: string): any {
    switch (name) {
        case "lobby": return new Lobby();
        case "game": return new Game();
        case "interval": return new Interval();
        case "result": return new Result();
        default: throw new Error();
    }
}
