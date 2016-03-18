import * as clone from "clone";
import {Land, Overlay} from "../status";

const FIELD = `
XXXXXXXXXXXXXXX
X   %%%%%%%   X
X X%X%X%X%X%X X
X %%%%%%%%%%% X
X%X%X%X%X%X%X%X
X%%%%%%%%%%%%%X
X%X%X%X%X%X%X%X
X%%%%%%%%%%%%%X
X%X%X%X%X%X%X%X
X %%%%%%%%%%% X
X X%X%X%X%X%X X
X   %%%%%%%   X
XXXXXXXXXXXXXXX
`
    .replace(/\n/g, "")
    .split("");

const LANDS = FIELD.map(x => {
    switch (x) {
        case "X": return Land.HARD_BLOCK;
        default: return Land.NONE;
    }
});

const OVERLAYS = FIELD.map(x => {
    switch (x) {
        case "%": return Overlay.SOFT_BLOCK;
        default: return Overlay.NONE;
    }
});

export function createField() {
    return clone({ lands: LANDS, overlays: OVERLAYS });
}

export function dropSuddenDeath(overlays: Overlay[], count: number) {
}
