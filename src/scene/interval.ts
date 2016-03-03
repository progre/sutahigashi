import Synchronizer from "../infrastructure/synchronizer";

export default async function interval(users: { name: string, winCount: number }[], winner: string, synchronizer: Synchronizer) {
    synchronizer.startScene("interval");
    await new Promise<number>((resolve, reject) => {
        setTimeout(resolve, 3000);
    });
    return false;
}
