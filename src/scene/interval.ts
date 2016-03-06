import Sender from "../infrastructure/sender";
import Users from "../domain/users";

export default async function interval(winner: number, users: Users, sender: Sender) {
    sender.send("interval", {
        users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
    });
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users, finished: true };
}
