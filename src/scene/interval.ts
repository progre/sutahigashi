import Sender from "../infrastructure/sender";
import {User} from "../domain/status";

const NAME = "interval";

export default async function interval(winner: number, users: User[], sender: Sender) {
    users = users.map((x, i) => {
        if (i !== winner) {
            return x;
        }
        return {
            id: x.id,
            name: x.name,
            wins: x.wins + 1
        };
    });
    sender.send(NAME, {
        interval: { users, winner }
    });
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users, finished: users.some(x => x.wins >= 2) };
}
