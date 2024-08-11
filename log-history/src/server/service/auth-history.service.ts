import { AppRepositoryMap, AuthHistoryRepository } from "../../contract/repository.contract";
import { AuthHistoryService } from "../../contract/service.contract";
import { List_Payload, ListResult } from "../../module/dto.module";
import { compose, composeResult, createData } from "../../utils/helper.utils";
import { AuthHistoryResult, CreateAuthHistory_Payload } from "../dto/auth-history.dto";
import { AuthHistoryAttribute, AuthHistoryCreationAttribute } from "../model/auth-history.model";
import { BaseService } from "./base.service";

export class AuthHistory extends BaseService implements AuthHistoryService {
    private authHistory!: AuthHistoryRepository;
    init(repository: AppRepositoryMap): void {
        this.authHistory = repository.authHistory;
    }

    create = async (payload: CreateAuthHistory_Payload): Promise<AuthHistoryResult> => {
        const { userXid, ip } = payload;

        const createdValues = createData<AuthHistoryCreationAttribute>({
            userXid,
            ip,
        });

        const result = await this.authHistory.insert(createdValues);

        return composeAuthHistory(result);
    };

    getList = async (payload: List_Payload): Promise<ListResult<AuthHistoryResult>> => {
        const result = await this.authHistory.findAuthHistory(payload);

        const items = compose(result.rows, composeAuthHistory);

        return {
            items,
            count: result.count,
        };
    };
}

export function composeAuthHistory(row: AuthHistoryAttribute): AuthHistoryResult {
    return composeResult(row, {
        xid: row._id.toString(),
        ip: row.ip,
    });
}
