import { AppServiceMap, CategoryService } from "../../contract/service.contract";
import { errorResponses } from "../../response";
import { getDetailOption, getForceUsersSession, WrapAppHandler } from "../../utils/helper.utils";
import { CreateCategory_Payload } from "../dto/category.dto";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { LogInMiddleware } from "../middleware/log-in.middleware";
import { isValidImage, validate } from "../validate";
import { CategoryValidator } from "../validate/category.validator";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class CategoryController extends BaseController {
    private service!: CategoryService;
    constructor() {
        super("/category");
    }

    init(service: AppServiceMap): void {
        this.service = service.category;
    }

    initRoute(): void {
        this.router.post("/", AdminMiddleware, WrapAppHandler(this.postCreateCategory));

        this.router.get("/:xid", LogInMiddleware, WrapAppHandler(this.getDetail));
    }

    postCreateCategory = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateCategory_Payload;

        validate(CategoryValidator.CreateCategory_Payload, payload);

        const image = isValidImage(req.files);

        if (!image) {
            throw errorResponses.badError("Image must be a image");
        }

        payload.image = image;

        payload.userSession = getForceUsersSession(req);

        const result = await this.service.create(payload);

        return result;
    };

    getDetail = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        const result = await this.service.getByXid(payload);

        return result;
    };
}
