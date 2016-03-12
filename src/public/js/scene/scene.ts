import SE from "../infrastructure/se";

export interface Scene {
    (
        loader: createjs.PreloadJS,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ): Promise<Scene>;
}
