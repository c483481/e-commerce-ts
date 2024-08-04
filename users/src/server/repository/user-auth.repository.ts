import { UsersAuthRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { UsersProfile } from "../model/user-profile.model";
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

    findByEmail = async (email: string): Promise<UsersAuthAttributes | null> => {
        return this.usersAuth.findOne({
            where: {
                email,
            },
            include: {
                model: UsersProfile,
            },
        });
    };

    findByXid = async (xid: string): Promise<UsersAuthAttributes | null> => {
        return this.usersAuth.findOne({
            where: {
                xid,
            },
            include: {
                model: UsersProfile,
            },
        });
    };
}
