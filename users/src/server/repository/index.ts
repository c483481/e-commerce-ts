import { AppRepositoryMap, UsersAuthRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";
import { SequelizeUsersAuthRepository } from "./user-auth.repository";

export class Repository implements AppRepositoryMap {
    readonly usersAuth: UsersAuthRepository = new SequelizeUsersAuthRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
