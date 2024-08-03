import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppServiceMap } from "../../contract/service.contract";
import { BaseService } from "./base.service";

export class Service implements AppServiceMap {
    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
