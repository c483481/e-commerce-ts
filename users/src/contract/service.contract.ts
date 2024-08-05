import { UserSession } from "../module/dto.module";
import { AuthPayload, AuthResult, RefreshTokenResult, UsersAuthResult } from "../server/dto/auth.dto";
import { CreateProfile_Payload, ProfileResult, UpdateProfile_Payload } from "../server/dto/profile.dto";

export interface AppServiceMap {
    auth: AuthService;
    profile: ProfileService;
}

export interface AuthService {
    register(payload: AuthPayload): Promise<UsersAuthResult>;

    login(payload: AuthPayload): Promise<AuthResult>;

    refreshToken(xid: string): Promise<RefreshTokenResult>;
}

export interface ProfileService {
    createProfile(payload: CreateProfile_Payload): Promise<ProfileResult>;

    getDetail(payload: UserSession): Promise<ProfileResult>;

    updateProfile(payload: UpdateProfile_Payload): Promise<ProfileResult>;
}
