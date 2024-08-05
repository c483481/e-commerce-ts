import { UsersProfileAttributes, UsersProfileCreationAttributes } from "../server/model/user-profile.model";
import { UsersAuthAttributes, UsersAuthCreationAttributes } from "../server/model/users-auth.model";

export interface AppRepositoryMap {
    usersAuth: UsersAuthRepository;
    usersProfile: UsersProfileRepository;
}

export interface UsersAuthRepository {
    insert(payload: UsersAuthCreationAttributes): Promise<UsersAuthAttributes>;

    findByEmail(email: string): Promise<UsersAuthAttributes | null>;

    findByXid(xid: string): Promise<UsersAuthAttributes | null>;
}

export interface UsersProfileRepository {
    insert(payload: UsersProfileCreationAttributes): Promise<UsersProfileAttributes>;

    findByUserAuthXid(xid: string): Promise<UsersProfileAttributes | null>;

    update(id: number, payload: Partial<UsersProfileAttributes>, version: number): Promise<number>;

    findByXidAndUserAuthXid(xid: string, userXid: string): Promise<UsersProfileAttributes | null>;
}
