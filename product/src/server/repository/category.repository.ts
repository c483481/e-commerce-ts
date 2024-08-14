import { CategoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { Category, CategoryAttributes, CategoryCreationAttributes } from "../model/category.model";
import { BaseRepository } from "./base.repository";

export class SequelizeCategoryRepository extends BaseRepository implements CategoryRepository {
    private category!: typeof Category;
    init(datasource: AppDataSource): void {
        this.category = datasource.sqlModel.Category;
    }

    insert = async (payload: CategoryCreationAttributes): Promise<CategoryAttributes> => {
        return this.category.create(payload);
    };

    findByXid = async (xid: string): Promise<CategoryAttributes | null> => {
        return this.category.findOne({
            where: {
                xid,
            },
        });
    };
}
