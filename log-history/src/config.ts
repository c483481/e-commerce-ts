import dotenv from "dotenv";
import { parseToNumber, parseToString } from "./utils/parse.utils";
import { compareString } from "./utils/compare.utils";
dotenv.config();

export interface AppConfiguration {
    isProduction: boolean;

    baseUrl: string;

    port: number;
    cors: string[];

    mongoseeUri: string;
    mongoseeUsername: string;
    mongoseePassword: string;
    mongooseeAuthSource: string;

    amqpUri: string;

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

        mongoseeUri: parseToString(process.env.MONGO_URI, "mongodb://localhost:27017/collection"),
        mongoseePassword: parseToString(process.env.MONGO_PASS),
        mongoseeUsername: parseToString(process.env.MONGO_USERNAME),
        mongooseeAuthSource: parseToString(process.env.MONGO_AUTH_SOURCE, "admin"),

        amqpUri: parseToString(process.env.AMQP_URI, "amqp://localhost:5672"),

        tokenHost: parseToString(process.env.TOKEN_HOST, "http://localhost:80"),
    };
}

export const config = initConfig();
