import { ulid } from "ulidx";
import { AppRepositoryMap, CategoryRepository } from "../../contract/repository.contract";
import { composeResult, createData } from "../../utils/helper.utils";
import { CategoryResult, CreateCategory_Payload } from "../dto/category.dto";
import { CategoryAttributes, CategoryCreationAttributes } from "../model/category.model";
import { BaseService } from "./base.service";
import { minioModule } from "../../module/minio.module";
import { bucket } from "../../constant/minio.constant";
import { errorResponses } from "../../response";

export class Category extends BaseService {
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
}

export function composeCategory(row: CategoryAttributes): CategoryResult {
    return composeResult(row, {
        name: row.name,
        active: row.active,
    });
}
