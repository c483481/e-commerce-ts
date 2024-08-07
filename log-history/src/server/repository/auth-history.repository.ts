import { AuthHistoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { AuthHistory, AuthHistoryAttribute, AuthHistoryCreationAttribute } from "../model/auth-history.model";
import { BaseRepository } from "./base.repository";

export class MongooseAuthHistoryRepository extends BaseRepository implements AuthHistoryRepository {
    private authHistory!: typeof AuthHistory;
    init(datasource: AppDataSource): void {
        this.authHistory = datasource.noSqlModel.AuthHistory;
    }

    insert = async (payload: AuthHistoryCreationAttribute): Promise<AuthHistoryAttribute> => {
        return this.authHistory.create(payload);
    };
}
