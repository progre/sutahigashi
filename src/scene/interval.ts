import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";

export default async function interval(winner: number, users: Users, synchronizer: Synchronizer) {
    synchronizer.startScene("interval", {
        users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
    });
    synchronizer.postScene("interval", {
        users: users.map(x => ({ name: x.name, wins: Math.random() * 4 | 0 }))
    })
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users, finished: true };
}
