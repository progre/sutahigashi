import SE from "../infrastructure/se";

export interface Scene {
    exec(
        loader: createjs.PreloadJS,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ): Promise<Scene>;
}
