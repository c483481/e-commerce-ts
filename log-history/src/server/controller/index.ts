import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";
import { BaseController } from "./base.controller";

export class Controller {
    init(service: AppServiceMap): Router {
        const router = Router();
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseController) {
                r.init(service);
                r.initRoute();

                const prefix = r.getPrefix();

                router.use(prefix, r.getRouter());

                console.log(`initiate ${k} route`);
            }
        });

        return router;
    }
}
