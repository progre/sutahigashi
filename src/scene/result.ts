import {getLogger} from "log4js";
let logger = getLogger();
import Synchronizer from "../infrastructure/synchronizer";
import * as lobby from "./lobby";

export const NAME = "result";

export async function exec(synchronizer: Synchronizer) {
    logger.info("Result starting.");
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3 * 1000);
    });
    logger.info("Result finished.");
    return lobby;
}
