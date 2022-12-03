import { IUser } from "./IUser";

export interface IRoom {
    name: string;
    revealCards: boolean;
    users: IUser[];
}