import { AppRepositoryMap, LogsRepository } from "../../contract/repository.contract";
import { LogsService } from "../../contract/service.contract";
import { composeResult, createData } from "../../utils/helper.utils";
import { CreateLogs_Payload, LogsResult } from "../dto/logs.dto";
import { LogsAttribute, LogsCreationAttribute } from "../model/logs.model";
import { BaseService } from "./base.service";

export class Logs extends BaseService implements LogsService {
    private logsRepo!: LogsRepository;
    init(repository: AppRepositoryMap): void {
        this.logsRepo = repository.logs;
    }

    create = async (payload: CreateLogs_Payload): Promise<LogsResult> => {
        const { ip, name, data, userXid } = payload;

        const createdValues = createData<LogsCreationAttribute>({
            ip,
            name,
            data,
            userXid,
        });

        const result = await this.logsRepo.insert(createdValues);

        return composeLogs(result);
    };
}

export function composeLogs(row: LogsAttribute): LogsResult {
    return composeResult(row, {
        ip: row.ip,
        name: row.name,
        data: row.data,
    });
}
