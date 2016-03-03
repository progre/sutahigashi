import lobby from "./lobby";
import game from "./game";
import interval from "./interval";
import result from "./result";

export default function createScene(name: string) {
    switch (name) {
        case "lobby": return lobby;
        case "game": return game;
        case "interval": return interval;
        case "result": return result;
        default: throw new Error();
    }
}
