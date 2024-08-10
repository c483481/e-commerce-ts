import { Router, Request, Response, NextFunction } from "express";
import { validate, validateGeneratePayload } from "./validate";
import { jwtModule } from "./module/jwt.module";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZE } from "./response";

const routes = Router();

routes.post("/generate_token", (req: Request, res: Response) => {
    const payload = req.body as { xid: string; email: string; audiance?: string };

    validate(validateGeneratePayload, payload);
    const { xid, email, audiance } = payload;

    const accessToken = jwtModule.issue({ xid, email }, audiance);
    const refreshToken = jwtModule.issueRefresh(xid, audiance);

    return res.status(200).json({
        accessToken,
        refreshToken,
    });
});

routes.post("/generate_ac", (req: Request, res: Response) => {
    const payload = req.body as { xid: string; email: string; audiance?: string };

    validate(validateGeneratePayload, payload);
    const { xid, email, audiance } = payload;

    const accessToken = jwtModule.issue({ xid, email }, audiance);

    return res.status(200).json({
        accessToken,
    });
});

routes.get("/check_at", (req: Request, res: Response, next: NextFunction) => {
    const payload = req.query;

    if (typeof payload.token !== "string" || !payload.token) {
        return next(ERROR_UNAUTHORIZE);
    }

    let audiance!: string;

    if (typeof payload.audiance === "string" && payload.audiance) {
        audiance = payload.audiance;
    }

    const token = payload.token;

    try {
        const verification = jwtModule.verify(token, audiance);
        const { xid, email } = verification.data;
        return res.status(200).json({
            xid,
            email,
            audiance: audiance ? audiance : null,
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            code: "E_AUTH",
            message: "Forbidden",
        });
    }
});

routes.get("/check_rt", (req: Request, res: Response, next: NextFunction) => {
    const payload = req.query;

    if (typeof payload.token !== "string" || !payload.token) {
        return res.status(401).json({
            success: false,
            code: "E_AUTH",
            message: "Unauthorize",
        });
    }

    const token = payload.token;

    try {
        const verification = jwtModule.verifyRefreshToken(token);

        const refreshToken = verification.data;

        return res.status(200).json({
            xid: refreshToken.xid,
        });
    } catch (_error) {
        next(ERROR_FORBIDDEN);
    }
});

export default routes;
