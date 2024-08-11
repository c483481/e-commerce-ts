import { AppServiceMap, LogsService } from "../../contract/service.contract";
import { getListOption, WrapAppHandler } from "../../utils/helper.utils";
import { LogInMiddleware } from "../middleware/log-in.middleware";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class LogsController extends BaseController {
    private service!: LogsService;
    constructor() {
        super("/log-history");
    }

    init(service: AppServiceMap): void {
        this.service = service.logs;
    }

    initRoute(): void {
        this.router.get("/", LogInMiddleware, WrapAppHandler(this.getListLogs));
    }

    getListLogs = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.getList(payload);

        return result;
    };
}
