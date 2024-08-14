import { UploadedFile } from "express-fileupload";
import { BaseResult, UserSession } from "../../module/dto.module";

export interface CreateCategory_Payload {
    name: string;
    image: UploadedFile;
    userSession: UserSession;
}

export interface CategoryResult extends BaseResult {
    name: string;
    active: boolean;
}
