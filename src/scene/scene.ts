import Synchronizer from "../infrastructure/synchronizer";
import Users from "../domain/users";

export interface Scene {
    NAME: string;
    exec(synchronizer: Synchronizer, users: Users): Promise<Scene>;
}
