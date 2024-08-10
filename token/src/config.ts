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

    jwtLifeTime: number;
    jwtRefreshLifeTime: number;
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

        jwtKey: parseToString(process.env.JWT_KEY, "secret1"),
        jwtRefreshKey: parseToString(process.env.JWT_REFRESH_KEY, "secret2"),

        jwtLifeTime: parseToNumber(process.env.LIFE_TIME_TOKEN, 3600),
        jwtRefreshLifeTime: parseToNumber(process.env.REFRESH_LIFE_TIME_TOKEN, 86400),
    };
}

export const config = initConfig();
