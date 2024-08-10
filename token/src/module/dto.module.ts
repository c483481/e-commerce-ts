export interface UserAuthToken {
    xid: string;
    email: string;
}

export type EncodeToken = {
    data: UserAuthToken;
};

export type EncodeRefreshToken = {
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
