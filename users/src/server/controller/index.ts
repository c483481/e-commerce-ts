import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthController } from "./auth.controller";
import { ProfileController } from "./profile.controller";

export class Controller {
    private readonly auth: BaseController = new AuthController();
    private readonly profile: BaseController = new ProfileController();

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
