import {Input} from "../../../domain/game/input";

export default class Controller {
    private up = false;
    private down = false;
    private left = false;
    private right = false;
    private bomb = false;
    private attack = false;

    constructor() {
        window.addEventListener("keydown", this);
    }

    release() {
        window.removeEventListener("keydown", this);
    }

    popStatus() {
        let status = <Input>{
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right,
            bomb: this.bomb,
            attack: this.attack,
            suicide: false
        };
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.bomb = false;
        this.attack = false;
        return status;
    }

    handleEvent(e: HTML5KeyboardEvent) {
        keyboardEventShim(e);
        switch (e.code) {
            case "ArrowUp": e.preventDefault(); this.up = true; return;
            case "ArrowDown": e.preventDefault(); this.down = true; return;
            case "ArrowLeft": e.preventDefault(); this.left = true; return;
            case "ArrowRight": e.preventDefault(); this.right = true; return;
            case "Space": e.preventDefault(); this.bomb = true; return;
            case "KeyZ": e.preventDefault(); this.bomb = true; return;
            case "KeyX": e.preventDefault(); this.attack = true; return;
            default: return;
        }
    }
}

function keyboardEventShim(e: HTML5KeyboardEvent) {
    if (e.code != null) {
        return;
    }
    if (e.key == null) {
        throw new Error("Unsupported browser.");
    }
    switch (e.key) {
        case "Up":
        case "Down":
        case "Left":
        case "Right":
            e.code = `Arrow${e.key}`;
            return;
        case " ":
            e.code = "Space";
            return;
        case "Z":
        case "z":
            e.code = "KeyZ";
            return;
        case "X":
        case "x":
            e.code = "KeyX";
            return;
        default:
            e.code = e.key;
            return;
    }
}

interface HTML5KeyboardEvent extends KeyboardEvent {
    code: string;
}
