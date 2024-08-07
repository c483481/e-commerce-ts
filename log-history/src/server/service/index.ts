import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppServiceMap, AuthHistoryService, LogsService } from "../../contract/service.contract";
import { AuthHistory } from "./auth-history.service";
import { BaseService } from "./base.service";
import { Logs } from "./logs.service";

export class Service implements AppServiceMap {
    readonly authHistory: AuthHistoryService = new AuthHistory();
    readonly logs: LogsService = new Logs();

    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
