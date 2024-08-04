import { BaseResult } from "../../module/dto.module";

export interface RegisterPayload {
    email: string;
    password: string;
}

export interface UsersAuthResult extends BaseResult {
    email: string;
    role: string;
}
