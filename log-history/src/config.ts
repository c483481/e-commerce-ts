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
}

function initConfig(): AppConfiguration {
    return {
        isProduction: compareString(parseToString(process.env.NODE_ENV), "production"),

        baseUrl: parseToString(process.env.BASE_URL),

        port: parseToNumber(process.env.PORT, 3000),
        cors: parseToString(process.env.CORS)
            .split(",")
            .map((str) => {
                return str.trim();
            }),

        mongoseeUri: parseToString(process.env.MONGO_URI),
        mongoseePassword: parseToString(process.env.MONGO_PASS),
        mongoseeUsername: parseToString(process.env.MONGO_USERNAME),
        mongooseeAuthSource: parseToString(process.env.MONGO_AUTH_SOURCE),

        amqpUri: parseToString(process.env.AMQP_URI),
    };
}

export const config = initConfig();
