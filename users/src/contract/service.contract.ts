import { RegisterPayload, UsersAuthResult } from "../server/dto/auth.dto";

export interface AppServiceMap {
    auth: AuthService;
}

export interface AuthService {
    register(payload: RegisterPayload): Promise<UsersAuthResult>;
}
