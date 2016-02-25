export function show(stage: createjs.Stage, socket: SocketIOClient.Socket) {
    socket.on("users", (users: { name: string }[]) => {
        (<HTMLTextAreaElement>document.getElementById("users"))
            .value = users.map(x => x.name).join("\n");
    });
    socket.emit("get users");

    document.getElementById("join")
        .addEventListener("click", e => {
            let input = <HTMLInputElement>document.getElementById("name");
            socket.emit("join", input.value);
            console.log("join emitted");
        });
    document.getElementById("leave")
        .addEventListener("click", e => {
            socket.emit("leave");
            console.log("leave emitted");
        });
    return <any>new Promise((resolve, reject) => {
    });
}
