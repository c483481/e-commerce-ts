import { JwtPayload } from "jsonwebtoken";

export interface UserAuthToken {
    xid: string;
    email: string;
}

export type EncodeToken = JwtPayload & {
    data: UserAuthToken;
};

export type EncodeRefreshToken = JwtPayload & {
    data: {
        xid: string;
    };
};

export type JwtResult = {
    token: string;
    lifeTime: number;
};

export type Token = {
    token: string;
    lifeTime: number;
};
