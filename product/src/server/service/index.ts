import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppServiceMap, CategoryService } from "../../contract/service.contract";
import { BaseService } from "./base.service";
import { Category } from "./category.service";

export class Service implements AppServiceMap {
    readonly category: CategoryService = new Category();

    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
