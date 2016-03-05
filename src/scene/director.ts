import Synchronizer from "../infrastructure/synchronizer";
import * as lobby from "./lobby";
import * as game from "./game";
import * as result from "./result";
import interval from "./interval";

export default async function direct(io: SocketIO.Server): Promise<void> {
    let synchronizer = new Synchronizer(io);
    while (true) {
        synchronizer.startScene(lobby.NAME);
        let numPlayers = await lobby.exec(synchronizer);
        synchronizer.startScene(game.NAME);
        do {
            await game.exec(numPlayers, synchronizer);
        } while (!(await interval([], "", synchronizer)).finished);
        synchronizer.startScene(result.NAME);
        await result.exec(synchronizer);
    }
}
