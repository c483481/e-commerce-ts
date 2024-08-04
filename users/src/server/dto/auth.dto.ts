import { BaseResult, Token } from "../../module/dto.module";

export interface AuthPayload {
    email: string;
    password: string;
}

export interface UsersAuthResult extends BaseResult {
    email: string;
    role: string;
}

export interface AuthResult extends UsersAuthResult {
    token: {
        accessToken: Token;
        refreshToken: Token;
    };
}
