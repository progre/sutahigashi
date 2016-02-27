import Synchronizer from "../infrastructure/synchronizer";

export interface Scene {
    NAME: string;
    exec(synchronizer: Synchronizer): Promise<Scene>;
}
