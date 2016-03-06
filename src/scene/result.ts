import {getLogger} from "log4js";
let logger = getLogger();
import Sender from "../infrastructure/sender";
import {User} from "../domain/status";

const NAME = "result";

export default async function result(sender: Sender, number: number, winner: User) {
    logger.info("Result starting.");
    sender.send(NAME, { result: { number, winner } });
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 3 * 1000);
    });
    logger.info("Result finished.");
}
