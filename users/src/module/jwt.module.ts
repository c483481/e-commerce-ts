import { config } from "../config";
import { sign, verify } from "jsonwebtoken";
import { EncodeRefreshToken, EncodeToken, JwtResult, UserAuthToken } from "./dto.module";

class JwtModule {
    private readonly jwtKey = config.jwtKey;
    private readonly jwtLifeTime = config.jwtLifeTime;
    private readonly jwtRefreshKey = config.jwtRefreshKey;
    private readonly jwtRefreshLifeTime = config.jwtRefreshLifeTime;

    issue = (data: UserAuthToken, audience?: string): JwtResult => {
        const token = sign({ data: { xid: data.xid, email: data.email } }, this.jwtKey, {
            expiresIn: this.jwtLifeTime,
            audience,
        });

        return {
            token,
            lifeTime: this.jwtLifeTime,
        };
    };

    issueRefresh = (xid: string, audience?: string): JwtResult => {
        const token = sign({ data: { xid } }, this.jwtRefreshKey, {
            audience,
        });

        return {
            token,
            lifeTime: this.jwtRefreshLifeTime,
        };
    };

    verify = (token: string, audience?: string): EncodeToken => {
        return verify(token, this.jwtKey, {
            audience,
        }) as EncodeToken;
    };

    verifyRefreshToken = (token: string, audience?: string): EncodeRefreshToken => {
        return verify(token, this.jwtRefreshKey, {
            audience,
        }) as EncodeRefreshToken;
    };
}

export const jwtModule = new JwtModule();
