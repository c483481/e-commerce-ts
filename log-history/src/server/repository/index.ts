import { AppRepositoryMap, AuthHistoryRepository, LogsRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { MongooseAuthHistoryRepository } from "./auth-history.repository";
import { BaseRepository } from "./base.repository";
import { MongooseLogsRepository } from "./logs.repository";

export class Repository implements AppRepositoryMap {
    readonly authHistory: AuthHistoryRepository = new MongooseAuthHistoryRepository();
    readonly logs: LogsRepository = new MongooseLogsRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
