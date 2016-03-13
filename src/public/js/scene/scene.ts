import SE from "../infrastructure/se";

export interface Scene {
    close(): void;

    exec(
        loader: createjs.PreloadJS,
        stage: createjs.Stage,
        se: SE,
        socket: SocketIOClient.Socket
    ): Promise<string>;
}
