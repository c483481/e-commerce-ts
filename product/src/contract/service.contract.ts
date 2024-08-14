import { GetDetail_Payload, List_Payload, ListResult } from "../module/dto.module";
import { CategoryResult, CreateCategory_Payload } from "../server/dto/category.dto";

export interface AppServiceMap {
    category: CategoryService;
}

export interface CategoryService {
    create(payload: CreateCategory_Payload): Promise<CategoryResult>;

    getByXid(payload: GetDetail_Payload): Promise<CategoryResult>;

    getList(payload: List_Payload): Promise<ListResult<CategoryResult>>;

    getDetailImage(payload: GetDetail_Payload): Promise<Buffer>;
}
