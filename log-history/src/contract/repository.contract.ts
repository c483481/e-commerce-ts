import { FindResult, List_Payload } from "../module/dto.module";
import { AuthHistoryAttribute, AuthHistoryCreationAttribute } from "../server/model/auth-history.model";
import { LogsAttribute, LogsCreationAttribute } from "../server/model/logs.model";

export interface AppRepositoryMap {
    authHistory: AuthHistoryRepository;
    logs: LogsRepository;
}

export interface AuthHistoryRepository {
    insert(payload: AuthHistoryCreationAttribute): Promise<AuthHistoryAttribute>;
}

export interface LogsRepository {
    insert(payload: LogsCreationAttribute): Promise<LogsAttribute>;

    findLogs(payload: List_Payload): Promise<FindResult<LogsAttribute>>;
}
