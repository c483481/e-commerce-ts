import { Dialect, Sequelize } from "sequelize";
import { AppSqlModel, initSqlModels } from "../server/model";
import { AppConfiguration } from "../config";
import { exec } from "child_process";

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
            await conn.authenticate();
            console.log("successfully connect to database");

            const migrationOutput = await this.execPromise("npx sequelize db:migrate");
            console.log(`Migration output: ${migrationOutput}`);

            await conn.sync();
            console.log(`All models in Sequelize were synchronized successfully in database : ${config.dbName}.`);
        } catch (error) {
            console.error("An error occurred while synchronizing the models:", error);
            console.log("try again in 2 seconds");
            await this.delay();
            return this.initSequelize(config);
        }

        return {
            sql: conn,
            sqlModel: sqlModel,
        };
    };

    private execPromise = async (command: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing command: ${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`Command stderr: ${stderr}`);
                    return;
                }
                resolve(stdout);
            });
        });
    };

    private delay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }
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
