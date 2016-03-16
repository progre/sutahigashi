import {Land, Overlay} from "../../../../domain/status";
import {CHIP_PIXEL, createResizedBitmap} from "./chip";

export const RESOURCES = [
    { id: "hardblock", src: "res/hardblock.jpg" },
    { id: "softblock", src: "res/softblock.png" }
];

export default function createField(loader: createjs.AbstractLoader, lands: Land[][], overlays: Overlay[][]) {
    let landImages = new Map<Land, createjs.DisplayObject>();
    for (let land of [Land.NONE, Land.HARD_BLOCK]) {
        landImages.set(land, loadImageForLand(loader, land));
    }
    let overlayImages = new Map<Overlay, createjs.DisplayObject>();
    for (let overlay of [Overlay.NONE, Overlay.SOFT_BLOCK]) {
        overlayImages.set(overlay, loadImageForOverlay(loader, overlay));
    }
    let field = new createjs.MovieClip();
    lands.forEach((line, y) => {
        line.forEach((chip, x) => {
            let image = landImages.get(chip).clone();
            image.x = x * CHIP_PIXEL;
            image.y = y * CHIP_PIXEL;
            field.addChild(image);
        });
    });
    overlays.forEach((line, y) => {
        line.forEach((chip, x) => {
            let image = overlayImages.get(chip).clone();
            image.x = x * CHIP_PIXEL;
            image.y = y * CHIP_PIXEL;
            field.addChild(image);
        });
    });
    return field;
}

function loadImageForLand(loader: createjs.AbstractLoader, land: Land): createjs.DisplayObject {
    switch (land) {
        case Land.NONE:
            let shape = new createjs.Shape();
            shape.graphics
                .beginFill("white")
                .drawRect(0, 0, CHIP_PIXEL, CHIP_PIXEL)
                .endFill();
            return shape;
        case Land.HARD_BLOCK:
            return createResizedBitmap(<any>loader.getResult("hardblock"));
        default: throw new Error();
    }
}

function loadImageForOverlay(loader: createjs.AbstractLoader, overlay: Overlay): createjs.DisplayObject {
    switch (overlay) {
        case Overlay.NONE:
            return new createjs.DisplayObject();
        case Overlay.SOFT_BLOCK:
            return createResizedBitmap(<any>loader.getResult("softblock"));
        default: throw new Error();
    }
}
