import { isValid, ulid } from "ulidx";
import { AppRepositoryMap, CategoryRepository } from "../../contract/repository.contract";
import { compose, composeResult, createData, updateData } from "../../utils/helper.utils";
import { CategoryResult, CreateCategory_Payload, UpdateCategory_Payload } from "../dto/category.dto";
import { CategoryAttributes, CategoryCreationAttributes } from "../model/category.model";
import { BaseService } from "./base.service";
import { minioModule } from "../../module/minio.module";
import { bucket } from "../../constant/minio.constant";
import { errorResponses } from "../../response";
import { GetDetail_Payload, List_Payload, ListResult } from "../../module/dto.module";
import { CategoryService } from "../../contract/service.contract";
import { ROLE } from "../../constant/role.constant";

export class Category extends BaseService implements CategoryService {
    private categoryRepo!: CategoryRepository;
    init(repository: AppRepositoryMap): void {
        this.categoryRepo = repository.category;
    }

    create = async (payload: CreateCategory_Payload): Promise<CategoryResult> => {
        const { image, name, userSession } = payload;

        const fileName = `${ulid()}.jpg`;

        const createdValues = createData<CategoryCreationAttributes>(
            {
                name: name,
                path: fileName,
                active: true,
            },
            userSession
        );

        const result = await this.categoryRepo.insert(createdValues);

        const createdImage = await minioModule.uploadImage(bucket.categoryBucket, fileName, image.data);

        if (!createdImage) {
            throw errorResponses.getError("E_SER_2");
        }

        return composeCategory(result);
    };

    getByXid = async (payload: GetDetail_Payload): Promise<CategoryResult> => {
        const { xid, usersSession } = payload;

        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const category = await this.categoryRepo.findByXid(xid);

        if (!category) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (!category.active && usersSession.audiance !== ROLE.admin) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return composeCategory(category);
    };

    getList = async (payload: List_Payload): Promise<ListResult<CategoryResult>> => {
        const result = await this.categoryRepo.findList(payload);

        const items = compose(result.rows, composeCategory);

        return {
            items,
            count: result.count,
        };
    };

    getDetailImage = async (payload: GetDetail_Payload): Promise<Buffer> => {
        const { xid, usersSession } = payload;

        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const category = await this.categoryRepo.findByXid(xid);

        if (!category) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (!category.active && usersSession.audiance !== ROLE.admin) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const image = await minioModule.getImage(bucket.categoryBucket, category.path);

        if (!image) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return image;
    };

    update = async (payload: UpdateCategory_Payload): Promise<CategoryResult> => {
        const { xid, userSession, image, name, version } = payload;

        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const category = await this.categoryRepo.findByXid(xid);

        if (!category) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const updatedValues = updateData<CategoryAttributes>(
            category,
            {
                name,
            },
            userSession
        );

        let fileName!: string;

        if (image) {
            fileName = `${ulid()}.jpg`;
            updatedValues.path = fileName;
        }

        const result = await this.categoryRepo.update(category.id, updatedValues, version);

        if (!result) {
            throw errorResponses.getError("E_ERR_1");
        }

        if (fileName && image) {
            const [deleteStatus, insertStatus] = await Promise.all([
                minioModule.deleteImage(bucket.categoryBucket, category.path),
                minioModule.uploadImage(bucket.categoryBucket, fileName, image.data),
            ]);

            if (!deleteStatus || !insertStatus) {
                throw errorResponses.getError("E_SER_2");
            }
        }

        Object.assign(category, updatedValues);

        return composeCategory(category);
    };

    delete = async (xid: string): Promise<void> => {
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const category = await this.categoryRepo.findByXid(xid);

        if (!category) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const result = await this.categoryRepo.deleteById(category.id);

        if (!result) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const deleted = await minioModule.deleteImage(bucket.categoryBucket, category.path);

        if (!deleted) {
            throw errorResponses.getError("E_SER_2");
        }

        console.log(`delete ${result} of category`);
    };
}

export function composeCategory(row: CategoryAttributes): CategoryResult {
    return composeResult(row, {
        name: row.name,
        active: row.active,
    });
}
