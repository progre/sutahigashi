export interface Scene {
    (
        loader: createjs.PreloadJS,
        stage: createjs.Stage,
        socket: SocketIOClient.Socket
    ): Promise<Scene>;
}
