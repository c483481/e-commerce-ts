import { FindResult, GetDetail_Payload, List_Payload } from "../module/dto.module";
import { CategoryAttributes, CategoryCreationAttributes } from "../server/model/category.model";

export interface AppRepositoryMap {
    category: CategoryRepository;
}

export interface CategoryRepository {
    insert(payload: CategoryCreationAttributes): Promise<CategoryAttributes>;

    findByXid(xid: string): Promise<CategoryAttributes | null>;

    findList(payload: List_Payload): Promise<FindResult<CategoryAttributes>>;

    update(id: number, payload: Partial<CategoryAttributes>, version: number): Promise<number>;

    deleteById(id: number): Promise<number>;
}
