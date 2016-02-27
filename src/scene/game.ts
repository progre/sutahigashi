import {getLogger} from "log4js";
let logger = getLogger();
import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";
import * as lobby from "./lobby";

export const NAME = "game";

export async function exec(synchronizer: Synchronizer, users: Users) {
    logger.info("Game starting.");
    synchronizer.postScene(NAME);
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3 * 1000);
    });
    logger.info("Game finish.");
    return lobby;
}
