import dotenv from "dotenv";
import { parseToNumber, parseToString } from "./utils/parse.utils";
import { compareString } from "./utils/compare.utils";
dotenv.config();

export interface AppConfiguration {
    isProduction: boolean;

    baseUrl: string;

    jwtKey: string;
    jwtRefreshKey: string;

    port: number;
    cors: string[];

    dbUser: string;
    dbPass: string;
    dbName: string;
    dbPort: number;
    dbHost: string;
    dbDialect: string;

    jwtLifeTime: number;
    jwtRefreshLifeTime: number;

    amqpUri: string;
}

function initConfig(): AppConfiguration {
    return {
        isProduction: compareString(parseToString(process.env.NODE_ENV), "production"),

        jwtKey: parseToString(process.env.JWT_KEY, "secret1"),
        jwtRefreshKey: parseToString(process.env.JWT_REFRESH_KEY, "secret2"),

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

        jwtLifeTime: parseToNumber(process.env.LIFE_TIME_TOKEN, 3600),
        jwtRefreshLifeTime: parseToNumber(process.env.REFRESH_LIFE_TIME_TOKEN, 86400),

        amqpUri: parseToString(process.env.AMQP_URI, "amqp://localhost:5672"),
    };
}

export const config = initConfig();
