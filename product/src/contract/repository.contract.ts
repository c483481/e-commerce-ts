import { CategoryAttributes, CategoryCreationAttributes } from "../server/model/category.model";

export interface AppRepositoryMap {
    category: CategoryRepository;
}

export interface CategoryRepository {
    insert(payload: CategoryCreationAttributes): Promise<CategoryAttributes>;
}
