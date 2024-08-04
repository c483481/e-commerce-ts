import { Dialect, Sequelize } from "sequelize";
import { AppSqlModel, initSqlModels } from "../server/model";
import { AppConfiguration } from "../config";

export interface AppDataSource {
    sql: Sequelize;
    sqlModel: AppSqlModel;
}

class DataSources {
    async init(config: AppConfiguration): Promise<AppDataSource> {
        const { sql, sqlModel } = await this.initSequelize(config);

        return {
            sql,
            sqlModel,
        };
    }

    private initSequelize = async (config: AppConfiguration): Promise<{ sql: Sequelize; sqlModel: AppSqlModel }> => {
        const conn = new Sequelize({
            dialect: getDialect(config.dbDialect),
            host: config.dbHost,
            port: config.dbPort,
            username: config.dbUser,
            password: config.dbPass,
            database: config.dbName,
            logging: console.log,
        });

        const sqlModel = initSqlModels(conn);

        try {
            await conn.sync();
            console.log(`All models in Sequelize were synchronized successfully in database : ${config.dbName}.`);
        } catch (error) {
            console.error("An error occurred while synchronizing the models:", error);
            throw new Error("Failed to connect to sql");
        }

        return {
            sql: conn,
            sqlModel: sqlModel,
        };
    };
}

function getDialect(str: string): Dialect {
    switch (str) {
        case "mysql":
        case "postgres":
        case "sqlite":
        case "mariadb":
        case "mssql":
        case "db2":
        case "snowflake":
        case "oracle":
            return str;
        default:
            return "postgres";
    }
}

export const datasource = new DataSources();
