import { Request, Response, NextFunction } from "express";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZE } from "../../response";
import { compareString } from "../../utils/compare.utils";
import { getIp, saveUsersSession } from "../../utils/helper.utils";
import { UserSession } from "../../module/dto.module";
import { jwtModule } from "../../module/jwt.module";

export function LogInMiddleware(req: Request, res: Response, next: NextFunction): void {
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
        const verification = jwtModule.verify(token);

        const userSession = verification.data as UserSession;

        userSession.ip = getIp(req);

        saveUsersSession(req, userSession);
        next();
    } catch (_error) {
        next(ERROR_FORBIDDEN);
    }
}
