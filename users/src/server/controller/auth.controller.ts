import { Request } from "express";
import { AppServiceMap, AuthService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthPayload } from "../dto/auth.dto";
import { getForceRefreshToken, WrapAppHandler } from "../../utils/helper.utils";
import { validate } from "../validate";
import { AuthValidator } from "../validate/auth.validator";
import { RefreshTokenMiddleware } from "../middleware/refresh-token.middleware";

export class AuthController extends BaseController {
    private service!: AuthService;
    constructor() {
        super("/auth");
    }

    init(service: AppServiceMap): void {
        this.service = service.auth;
    }

    initRoute(): void {
        this.router.post("/register", WrapAppHandler(this.postRegisterUser));

        this.router.post("/login", WrapAppHandler(this.postLoginUser));

        this.router.get("/", RefreshTokenMiddleware, WrapAppHandler(this.getRefreshToken));
    }

    postRegisterUser = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthPayload;

        validate(AuthValidator.AuthPayload, payload);

        const result = await this.service.register(payload);

        return result;
    };

    postLoginUser = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthPayload;

        validate(AuthValidator.AuthPayload, payload);

        const result = await this.service.login(payload);

        return result;
    };

    getRefreshToken = async (req: Request): Promise<unknown> => {
        const refreshToken = getForceRefreshToken(req);

        const result = await this.service.refreshToken(refreshToken);

        return result;
    };
}
