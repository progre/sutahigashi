import {getLogger} from "log4js";
let logger = getLogger();
import Sender from "../infrastructure/sender";

const NAME = "result";

export default async function result(sender: Sender) {
    logger.info("Result starting.");
    sender.send(NAME, null);
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3 * 1000);
    });
    logger.info("Result finished.");
}
