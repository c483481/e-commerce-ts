import { BaseResult, Token } from "../../module/dto.module";
import { ProfileResult } from "./profile.dto";

export interface AuthPayload {
    email: string;
    password: string;
}

export interface UsersAuthResult extends BaseResult {
    email: string;
    role: string;
    usersProfile: ProfileResult | null;
}

export interface AuthResult extends UsersAuthResult {
    token: {
        accessToken: Token;
        refreshToken: Token;
    };
}
