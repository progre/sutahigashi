import {Land} from "../../../domain/status";
import * as Field from "../../../domain/game/field";
import {CHIP_PIXEL, createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "hardblock", src: "res/hardblock.jpg" }
];

export default function createField(loadQueue: createjs.LoadQueue) {
    let field = new createjs.MovieClip();
    Field.createField().forEach((line, y) => {
        line.forEach((chip, x) => {
            let image = loadImage(loadQueue, chip);
            image.x = x * CHIP_PIXEL;
            image.y = y * CHIP_PIXEL;
            field.addChild(image);
        });
    });
    return field;
}

function loadImage(loadQueue: createjs.LoadQueue, land: Land): createjs.DisplayObject {
    switch (land) {
        case Land.NONE:
            let shape = new createjs.Shape();
            shape.graphics
                .beginFill("white")
                .drawRect(0, 0, CHIP_PIXEL, CHIP_PIXEL)
                .endFill();
            return shape;
        case Land.HARDBLOCK:
            return createResizedBitmap(<any>loadQueue.getResult("hardblock"));
        default: throw new Error();
    }
}
