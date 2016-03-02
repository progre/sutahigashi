import Synchronizer from "../infrastructure/synchronizer";
import * as lobby from "./lobby";
import * as game from "./game";
import * as result from "./result";

export default async function direct(io: SocketIO.Server): Promise<void> {
    let synchronizer = new Synchronizer(io);
    while (true) {
        synchronizer.startScene(lobby.NAME);
        let numPlayers = await lobby.exec(synchronizer);
        synchronizer.startScene(game.NAME);
        await game.exec(numPlayers, synchronizer);
        synchronizer.startScene(result.NAME);
        await result.exec(synchronizer);
    }
}
