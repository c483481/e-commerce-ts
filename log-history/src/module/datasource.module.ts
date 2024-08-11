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
            console.log("try again in 2 seconds");
            await this.delay();
            return this.initMongosee(config);
        }

        const noSqlModel = initNoSqlModels();

        return noSqlModel;
    };

    private delay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

export const datasource = new DataSources();
