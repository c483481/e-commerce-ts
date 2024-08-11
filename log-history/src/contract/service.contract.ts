import { List_Payload, ListResult } from "../module/dto.module";
import { AuthHistoryResult, CreateAuthHistory_Payload } from "../server/dto/auth-history.dto";
import { CreateLogs_Payload, LogsResult } from "../server/dto/logs.dto";

export interface AppServiceMap {
    authHistory: AuthHistoryService;
    logs: LogsService;
}

export interface AuthHistoryService {
    create(payload: CreateAuthHistory_Payload): Promise<AuthHistoryResult>;

    getList(payload: List_Payload): Promise<ListResult<AuthHistoryResult>>;
}

export interface LogsService {
    create(payload: CreateLogs_Payload): Promise<LogsResult>;

    getList(payload: List_Payload): Promise<ListResult<LogsResult>>;
}
