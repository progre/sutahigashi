import {Input} from "../../../domain/game/input";

export default class Controller {
    private up = false;
    private down = false;
    private left = false;
    private right = false;
    private bomb = false;

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
            bomb: this.bomb
        };
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.bomb = false;
        return status;
    }

    handleEvent(e: HTML5KeyboardEvent) {
        keyboardEventShim(e);
        switch (e.code) {
            case "ArrowUp": this.up = true; return;
            case "ArrowDown": this.down = true; return;
            case "ArrowLeft": this.left = true; return;
            case "ArrowRight": this.right = true; return;
            case "Space": this.bomb = true; return;
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
        default:
            e.code = e.key;
            return;
    }
}

interface HTML5KeyboardEvent extends KeyboardEvent {
    code: string;
}
