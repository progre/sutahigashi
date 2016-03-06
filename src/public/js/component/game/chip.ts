export const CHIP_PIXEL = 80;
export const FIELD_PIXEL = { width: CHIP_PIXEL * 15, height: CHIP_PIXEL * 13 };

export function createResizedBitmap(image: HTMLImageElement) {
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = CHIP_PIXEL / image.width;
    bitmap.scaleY = CHIP_PIXEL / image.height;
    return bitmap;
}
