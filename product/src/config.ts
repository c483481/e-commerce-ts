import dotenv from "dotenv";
import { parseToNumber, parseToString } from "./utils/parse.utils";
import { compareString } from "./utils/compare.utils";
dotenv.config();

export interface AppConfiguration {
    isProduction: boolean;

    baseUrl: string;

    port: number;
    cors: string[];

    dbUser: string;
    dbPass: string;
    dbName: string;
    dbPort: number;
    dbHost: string;
    dbDialect: string;

    tokenHost: string;
}

function initConfig(): AppConfiguration {
    return {
        isProduction: compareString(parseToString(process.env.NODE_ENV), "production"),

        baseUrl: parseToString(process.env.BASE_URL, "http://localhost"),

        port: parseToNumber(process.env.PORT, 80),
        cors: parseToString(process.env.CORS, "*")
            .split(",")
            .map((str) => {
                return str.trim();
            }),

        dbHost: parseToString(process.env.DB_HOST, "localhost"),
        dbName: parseToString(process.env.DB_NAME, "newdb"),
        dbUser: parseToString(process.env.DB_USER, "root"),
        dbPass: parseToString(process.env.DB_PASS, "root"),
        dbDialect: parseToString(process.env.DB_DIALECT, "mysql"),
        dbPort: parseToNumber(process.env.DB_PORT, 3306),

        tokenHost: parseToString(process.env.TOKEN_HOST, "http://localhost:80"),
    };
}

export const config = initConfig();
