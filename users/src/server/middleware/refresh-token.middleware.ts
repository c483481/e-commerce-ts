import { Request, Response, NextFunction } from "express";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZE } from "../../response";
import { compareString } from "../../utils/compare.utils";
import { jwtModule } from "../../module/jwt.module";
import { saveRefreshToken } from "../../utils/helper.utils";

export function RefreshTokenMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        next(ERROR_UNAUTHORIZE);
        return;
    }

    const [tokenType, token] = accessToken.split(" ");
    if (!compareString(tokenType, "Bearer") || !token) {
        next(ERROR_UNAUTHORIZE);
        return;
    }

    try {
        const verification = jwtModule.verifyRefreshToken(token);

        delete req.headers.authorization;

        const refreshToken = verification.data;

        saveRefreshToken(req, refreshToken);
        next();
    } catch (_error) {
        next(ERROR_FORBIDDEN);
    }
}
