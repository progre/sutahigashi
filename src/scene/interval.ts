import Synchronizer from "../infrastructure/synchronizer";

export default async function interval(winner: number, synchronizer: Synchronizer) {
    synchronizer.startScene("interval");
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return { users: synchronizer.users, finished: true };
}
