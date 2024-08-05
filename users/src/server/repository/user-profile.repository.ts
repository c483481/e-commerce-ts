import { UsersProfileRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { UsersProfile, UsersProfileAttributes, UsersProfileCreationAttributes } from "../model/user-profile.model";
import { UsersAuth } from "../model/users-auth.model";
import { BaseRepository } from "./base.repository";

export class SequelizeUsersProfileRepository extends BaseRepository implements UsersProfileRepository {
    private usersProfile!: typeof UsersProfile;

    init(datasource: AppDataSource): void {
        this.usersProfile = datasource.sqlModel.UsersProfile;
    }

    insert = async (payload: UsersProfileCreationAttributes): Promise<UsersProfileAttributes> => {
        return this.usersProfile.create(payload);
    };

    findByUserAuthXid = async (xid: string): Promise<UsersProfileAttributes | null> => {
        return this.usersProfile.findOne({
            include: {
                model: UsersAuth,
                where: {
                    xid,
                },
            },
        });
    };
}
