import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";

export const NAME = "lobby";

export async function exec(synchronizer: Synchronizer) {
    return await new Promise<number>((resolve, reject) => {
        synchronizer.on("usersupdate", function onUpdate(users: Users) {
            synchronizer.postScene(NAME, null);
            if (users.length < 2) {
                return;
            }
            synchronizer.removeListener("usersupdate", onUpdate);
            resolve(users.length);
        });
    });
}
