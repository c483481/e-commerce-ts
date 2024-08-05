import { AppServiceMap, ProfileService } from "../../contract/service.contract";
import { getForceUsersSession, WrapAppHandler } from "../../utils/helper.utils";
import { CreateProfile_Payload } from "../dto/profile.dto";
import { LogInMiddleware } from "../middleware/log-in.middleware";
import { validate } from "../validate";
import { ProfileValidator } from "../validate/profile.validator";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class ProfileController extends BaseController {
    private service!: ProfileService;
    constructor() {
        super("/profile");
    }

    init(service: AppServiceMap): void {
        this.service = service.profile;
    }

    initRoute(): void {
        this.router.post("/", LogInMiddleware, WrapAppHandler(this.postCreateProfile));
    }

    postCreateProfile = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateProfile_Payload;

        validate(ProfileValidator.CreateProfile_Payload, payload);

        payload.usersSession = getForceUsersSession(req);

        const result = await this.service.createProfile(payload);

        return result;
    };
}