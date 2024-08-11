import { FilterQuery, SortOrder } from "mongoose";
import { LogsRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
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

    findLogs = async (payload: List_Payload): Promise<FindResult<LogsAttribute>> => {
        const { field, sort } = this.parseSortBy(payload.sortBy);

        const where: FilterQuery<LogsAttribute> = { userXid: payload.usersSession.xid };

        const logs = this.logs.find(where).sort({ [field]: sort });

        if (!payload.showAll) {
            logs.limit(payload.limit).skip(payload.skip);
        }

        const [rows, count] = await Promise.all([logs.exec(), this.logs.countDocuments(where)]);

        return {
            rows,
            count,
        };
    };

    parseSortBy = (sortBy: string): { field: Partial<keyof LogsAttribute>; sort: SortOrder } => {
        // determine sorting option
        let field!: Partial<keyof LogsAttribute>;
        let sort!: SortOrder;
        switch (sortBy) {
            case "createdAt-asc": {
                field = "createdAt";
                sort = "asc";
                break;
            }
            case "createdAt-desc": {
                field = "createdAt";
                sort = "desc";
                break;
            }
            case "updatedAt-asc": {
                field = "updatedAt";
                sort = "asc";
                break;
            }
            case "updatedAt-desc": {
                field = "updatedAt";
                sort = "desc";
                break;
            }
            default: {
                field = "createdAt";
                sort = "desc";
                break;
            }
        }

        return { field, sort };
    };
}
