import { Request, Response, NextFunction } from "express";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZE, errorResponses } from "../../response";
import { compareString } from "../../utils/compare.utils";
import { saveRefreshToken } from "../../utils/helper.utils";
import { tokenModule } from "../../module/token.module";

export async function RefreshTokenMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
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

    const verification = await tokenModule.checkRefreshToken(token);

    if (!verification) {
        return next(errorResponses.getError("E_SER_1"));
    }

    if (verification === "unauthorize") {
        return next(ERROR_UNAUTHORIZE);
    }

    if (verification === "forbidden") {
        return next(ERROR_FORBIDDEN);
    }

    saveRefreshToken(req, verification);
    return next();
}
