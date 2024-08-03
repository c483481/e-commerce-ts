import { UsersAuthAttributes, UsersAuthCreationAttributes } from "../server/model/users-auth.model";

export interface AppRepositoryMap {
    usersAuth: UsersAuthRepository;
}

export interface UsersAuthRepository {
    insert(payload: UsersAuthCreationAttributes): Promise<UsersAuthAttributes>;

    findByEmail(email: string): Promise<UsersAuthAttributes | null>;
}
