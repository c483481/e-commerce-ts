import { UsersAuthRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { UsersAuth, UsersAuthAttributes, UsersAuthCreationAttributes } from "../model/users-auth.model";
import { BaseRepository } from "./base.repository";

export class SequelizeUsersAuthRepository extends BaseRepository implements UsersAuthRepository {
    private usersAuth!: typeof UsersAuth;
    init(datasource: AppDataSource): void {
        this.usersAuth = datasource.sqlModel.UsersAuth;
    }

    insert = async (payload: UsersAuthCreationAttributes): Promise<UsersAuthAttributes> => {
        return this.usersAuth.create(payload);
    };
}
