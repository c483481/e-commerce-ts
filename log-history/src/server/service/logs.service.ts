import { AppRepositoryMap, LogsRepository } from "../../contract/repository.contract";
import { LogsService } from "../../contract/service.contract";
import { List_Payload, ListResult } from "../../module/dto.module";
import { compose, composeResult, createData } from "../../utils/helper.utils";
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

    getList = async (payload: List_Payload): Promise<ListResult<LogsResult>> => {
        const result = await this.logsRepo.findLogs(payload);

        const items = compose(result.rows, composeLogs);

        return {
            items,
            count: result.count,
        };
    };
}

export function composeLogs(row: LogsAttribute): LogsResult {
    return composeResult(row, {
        xid: row._id.toString(),
        ip: row.ip,
        name: row.name,
        data: row.data,
    });
}
