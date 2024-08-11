import { AppServiceMap, AuthHistoryService } from "../../contract/service.contract";
import { getListOption, WrapAppHandler } from "../../utils/helper.utils";
import { LogInMiddleware } from "../middleware/log-in.middleware";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class AuthHistoryController extends BaseController {
    private service!: AuthHistoryService;
    constructor() {
        super("/auth-history");
    }

    init(service: AppServiceMap): void {
        this.service = service.authHistory;
    }

    initRoute(): void {
        this.router.get("/", LogInMiddleware, WrapAppHandler(this.getListAuthHistory));
    }

    getListAuthHistory = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.getList(payload);

        return result;
    };
}
