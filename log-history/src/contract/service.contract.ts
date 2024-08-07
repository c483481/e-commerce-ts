import { AuthHistoryResult, CreateAuthHistory_Payload } from "../server/dto/auth-history.dto";

export interface AppServiceMap {
    authHistory: AuthHistoryService;
}

export interface AuthHistoryService {
    create(payload: CreateAuthHistory_Payload): Promise<AuthHistoryResult>;
}
