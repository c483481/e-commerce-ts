import { UploadedFile } from "express-fileupload";
import { BaseResult, BaseUpdateAttribute, UserSession } from "../../module/dto.module";

export interface CreateCategory_Payload {
    name: string;
    image: UploadedFile;
    userSession: UserSession;
}

export interface UpdateCategory_Payload extends BaseUpdateAttribute {
    name: string;
    image: UploadedFile | null;
    userSession: UserSession;
}

export interface CategoryResult extends BaseResult {
    name: string;
    active: boolean;
}
