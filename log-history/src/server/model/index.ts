import { AuthHistory } from "./auth-history.model";
import { Logs } from "./logs.model";

export interface AppNoSqlModel {
    AuthHistory: typeof AuthHistory;
    Logs: typeof Logs;
}

export function initNoSqlModels(): AppNoSqlModel {
    return {
        AuthHistory,
        Logs,
    };
}
