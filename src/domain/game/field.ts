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
    .split("\n")
    .splice(1)
    .map(line => line.split(""));

const LANDS = FIELD.reduce((p, c) => p.concat(c)).map(x => {
    switch (x) {
        case "X": return Land.HARD_BLOCK;
        default: return Land.NONE;
    }
});

const OVERLAYS = FIELD.map(line => line.map(x => {
    switch (x) {
        case "%": return Overlay.SOFT_BLOCK;
        default: return Overlay.NONE;
    }
}));

export function createField() {
    return clone({ lands: LANDS, overlays: OVERLAYS });
}
