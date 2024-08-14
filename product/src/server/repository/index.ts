import { AppRepositoryMap, CategoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";
import { SequelizeCategoryRepository } from "./category.repository";

export class Repository implements AppRepositoryMap {
    readonly category: CategoryRepository = new SequelizeCategoryRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
