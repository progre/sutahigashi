import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import * as game from "./game";

export const NAME = "lobby";

export async function exec(synchronizer: Synchronizer) {
    await new Promise((resolve, reject) => {
        synchronizer.on("usersupdate", function onUpdate(users: Users) {
            synchronizer.postScene(NAME, null);
            if (users.length < 1) {
                return;
            }
            synchronizer.removeListener("usersupdate", onUpdate);
            resolve();
        });
    });
    return game;
}
