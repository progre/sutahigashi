import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";

export default async function interval(winner: number, users: Users, synchronizer: Synchronizer) {
    synchronizer.startScene("interval");
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users, finished: true };
}
