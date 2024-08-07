import { AppRepositoryMap, AuthHistoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { MongooseAuthHistoryRepository } from "./auth-history.repository";
import { BaseRepository } from "./base.repository";

export class Repository implements AppRepositoryMap {
    readonly authHistory: AuthHistoryRepository = new MongooseAuthHistoryRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
