import {CHIP_PIXEL, createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "hardblock", src: "res/hardblock.jpg" }
];

enum Chip {
    NONE, HARDBLOCK, SOFTBLOCK, BOMB
}

const FIELD = `
###############
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
###############
`.split("\n")
    .splice(1)
    .map(x => x.split("").map(x => {
        switch (x) {
            case " ": return Chip.NONE;
            case "#": return Chip.HARDBLOCK;
            default: throw new Error();
        }
    }));

export default function createField(loadQueue: createjs.LoadQueue) {
    let field = new createjs.MovieClip();
    FIELD.forEach((line, y) => {
        line.forEach((chip, x) => {
            let image = loadImage(loadQueue, chip);
            image.x = x * CHIP_PIXEL;
            image.y = y * CHIP_PIXEL;
            field.addChild(image);
        });
    });
    return field;
}

function loadImage(loadQueue: createjs.LoadQueue, chip: Chip): createjs.DisplayObject {
    switch (chip) {
        case Chip.NONE:
            let shape = new createjs.Shape();
            shape.graphics
                .beginFill("white")
                .drawRect(0, 0, CHIP_PIXEL, CHIP_PIXEL)
                .endFill();
            return shape;
        case Chip.HARDBLOCK:
            return createResizedBitmap(<any>loadQueue.getResult("hardblock"));
        default: throw new Error();
    }
}
