import { UserSession } from "../module/dto.module";
import { AuthPayload, AuthResult, UsersAuthResult } from "../server/dto/auth.dto";
import { CreateProfile_Payload, ProfileResult } from "../server/dto/profile.dto";

export interface AppServiceMap {
    auth: AuthService;
    profile: ProfileService;
}

export interface AuthService {
    register(payload: AuthPayload): Promise<UsersAuthResult>;

    login(payload: AuthPayload): Promise<AuthResult>;
}

export interface ProfileService {
    createProfile(payload: CreateProfile_Payload): Promise<ProfileResult>;

    getDetail(payload: UserSession): Promise<ProfileResult>;
}
