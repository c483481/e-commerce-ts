import { AuthHistoryAttribute, AuthHistoryCreationAttribute } from "../server/model/auth-history.model";

export interface AppRepositoryMap {
    authHistory: AuthHistoryRepository;
}

export interface AuthHistoryRepository {
    insert(payload: AuthHistoryCreationAttribute): Promise<AuthHistoryAttribute>;
}
