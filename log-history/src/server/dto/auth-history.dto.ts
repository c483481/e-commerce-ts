import { BaseResult } from "../../module/dto.module";

export interface CreateAuthHistory_Payload {
    ip: string;
    userXid: string;
}

export interface AuthHistoryResult extends BaseResult {
    xid: string;
    ip: string;
}
