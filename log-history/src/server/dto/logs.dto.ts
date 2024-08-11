import { BaseResult } from "../../module/dto.module";

export interface CreateLogs_Payload {
    ip: string;
    name: string;
    data: string;
    userXid: string;
}

export interface LogsResult extends BaseResult {
    xid: string;
    ip: string;
    name: string;
    data: string;
}
