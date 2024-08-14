import { CategoryResult, CreateCategory_Payload } from "../server/dto/category.dto";

export interface AppServiceMap {
    category: CategoryService;
}

export interface CategoryService {
    create(payload: CreateCategory_Payload): Promise<CategoryResult>;
}
