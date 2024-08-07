import { AuthHistory } from "./auth-history.model";

export interface AppNoSqlModel {
    AuthHistory: typeof AuthHistory;
}

export function initNoSqlModels(): AppNoSqlModel {
    return {
        AuthHistory,
    };
}
