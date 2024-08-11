import { SortOrder } from "mongoose";
import { AuthHistoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { AuthHistory, AuthHistoryAttribute, AuthHistoryCreationAttribute } from "../model/auth-history.model";
import { BaseRepository } from "./base.repository";
import { FindResult, List_Payload } from "../../module/dto.module";
import { FilterQuery } from "mongoose";

export class MongooseAuthHistoryRepository extends BaseRepository implements AuthHistoryRepository {
    private authHistory!: typeof AuthHistory;
    init(datasource: AppDataSource): void {
        this.authHistory = datasource.noSqlModel.AuthHistory;
    }

    insert = async (payload: AuthHistoryCreationAttribute): Promise<AuthHistoryAttribute> => {
        return this.authHistory.create(payload);
    };

    findAuthHistory = async (payload: List_Payload): Promise<FindResult<AuthHistoryAttribute>> => {
        const { field, sort } = this.parseSortBy(payload.sortBy);

        const where: FilterQuery<AuthHistoryAttribute> = { userXid: payload.usersSession.xid };

        const authHistory = this.authHistory.find(where).sort({ [field]: sort });

        if (!payload.showAll) {
            authHistory.limit(payload.limit).skip(payload.skip);
        }

        const [rows, count] = await Promise.all([authHistory.exec(), this.authHistory.countDocuments(where)]);

        return {
            rows,
            count,
        };
    };

    parseSortBy = (sortBy: string): { field: Partial<keyof AuthHistoryAttribute>; sort: SortOrder } => {
        // determine sorting option
        let field!: Partial<keyof AuthHistoryAttribute>;
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
