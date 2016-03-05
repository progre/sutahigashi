export function createContainer() {
    let element = document.createElement("div");
    element.id = (Math.floor(Math.random() * 10000000000000000)).toString();
    element.style.position = "absolute";
    return element;
}
