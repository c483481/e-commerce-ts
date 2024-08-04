import { Request } from "express";
import { AppServiceMap, AuthService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthPayload } from "../dto/auth.dto";
import { WrapAppHandler } from "../../utils/helper.utils";
import { validate } from "../validate";
import { AuthValidator } from "../validate/auth.validator";

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
    }

    postRegisterUser = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthPayload;

        validate(AuthValidator.AuthPayload, payload);

        const result = await this.service.register(payload);

        return result;
    };
}
