import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";

export class Repository implements AppRepositoryMap {
    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
