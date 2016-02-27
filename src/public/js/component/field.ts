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

export const RESOURCES = [
    { id: "hardblock", src: "res/hardblock.jpg" }
];

const CHIP_SIZE = 54;

export default function createField(loadQueue: createjs.LoadQueue) {
    let field = new createjs.MovieClip();
    FIELD.forEach((line, y) => {
        line.forEach((chip, x) => {
            let image = loadImage(loadQueue, chip);
            image.x = x * CHIP_SIZE;
            image.y = y * CHIP_SIZE;
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
                .drawRect(0, 0, CHIP_SIZE, CHIP_SIZE)
                .endFill();
            return shape;
        case Chip.HARDBLOCK:
            let image = <HTMLImageElement>loadQueue.getResult("hardblock");
            let bitmap = new createjs.Bitmap(image);
            bitmap.scaleX = CHIP_SIZE / image.width;
            bitmap.scaleY = CHIP_SIZE / image.height;
            return bitmap;
        default: throw new Error();
    }
}
