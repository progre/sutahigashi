import Sender from "../infrastructure/sender";
import Users from "../domain/users";

const NAME = "interval";

export default async function interval(winner: number, users: Users, sender: Sender) {
    sender.send(NAME, {
        interval: {
            users: users.map(x => x),
            winner
        }
    });
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users, finished: true };
}
