import { AuthPayload, AuthResult, UsersAuthResult } from "../server/dto/auth.dto";

export interface AppServiceMap {
    auth: AuthService;
}

export interface AuthService {
    register(payload: AuthPayload): Promise<UsersAuthResult>;

    login(payload: AuthPayload): Promise<AuthResult>;
}
