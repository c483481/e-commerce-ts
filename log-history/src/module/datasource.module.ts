import mongoose from "mongoose";
import { AppConfiguration } from "../config";
import { AppNoSqlModel, initNoSqlModels } from "../server/model";

export interface AppDataSource {
    noSqlModel: AppNoSqlModel;
}

class DataSources {
    async init(config: AppConfiguration): Promise<AppDataSource> {
        const noSqlModel = await this.initMongosee(config);

        return {
            noSqlModel,
        };
    }

    private initMongosee = async (config: AppConfiguration): Promise<AppNoSqlModel> => {
        try {
            await mongoose.connect(config.mongoseeUri, {
                auth: {
                    username: config.mongoseeUsername || undefined,
                    password: config.mongoseePassword || undefined,
                },
                authSource: config.mongooseeAuthSource || "admin",
            });
            console.log(`Success to connect : ${config.mongoseeUri}`);
        } catch (error) {
            console.error("An error connect to mongodb :", error);
            throw new Error(`Failed to connect to no sql with uri : ${config.mongoseeUri}`);
        }

        const noSqlModel = initNoSqlModels();

        return noSqlModel;
    };
}

export const datasource = new DataSources();
