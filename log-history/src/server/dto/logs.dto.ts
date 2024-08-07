import { BaseResult } from "../../module/dto.module";

export interface CreateLogs_Payload {
    ip: string;
    name: string;
    data: string;
    userXid: string;
}

export interface LogsResult extends BaseResult {
    ip: string;
    name: string;
    data: string;
}
