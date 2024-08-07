import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppServiceMap, AuthHistoryService } from "../../contract/service.contract";
import { AuthHistory } from "./auth-history.service";
import { BaseService } from "./base.service";

export class Service implements AppServiceMap {
    readonly authHistory: AuthHistoryService = new AuthHistory();

    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
