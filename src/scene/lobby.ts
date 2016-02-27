import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import * as game from "./game";

export const NAME = "lobby";

export function exec(synchronizer: Synchronizer, users: Users) {
    return new Promise((resolve, reject) => {
        synchronizer.postScene(NAME);
        users.on("update", function onUpdate() {
            synchronizer.postScene(NAME);
            if (users.length < 1) {
                return;
            }
            users.removeListener("update", onUpdate);
            resolve(game);
        });
    });
}
