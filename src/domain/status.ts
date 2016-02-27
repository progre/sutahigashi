export interface Status {
    version: number;
    scene: string;
    users: User[];
}

export interface User {
    name: string;
}
