import { LogsRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { Logs, LogsAttribute, LogsCreationAttribute } from "../model/logs.model";
import { BaseRepository } from "./base.repository";

export class MongooseLogsRepository extends BaseRepository implements LogsRepository {
    private logs!: typeof Logs;
    init(datasource: AppDataSource): void {
        this.logs = datasource.noSqlModel.Logs;
    }

    insert = async (payload: LogsCreationAttribute): Promise<LogsAttribute> => {
        return this.logs.create(payload);
    };
}
