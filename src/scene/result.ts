import {getLogger} from "log4js";
let logger = getLogger();
import * as lobby from "./lobby";

export const NAME = "result";

export async function exec() {
    logger.info("Result starting.");
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3 * 1000);
    });
    logger.info("Result finished.");
    return lobby;
}
