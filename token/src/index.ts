import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";
import { handleError, handleNotFound, handleRequest } from "./handler";
import { errorResponses } from "./response";
import routes from "./routes";

start();

async function start(): Promise<void> {
    errorResponses.init();

    const app = initApi();
    app.listen(config.port, () => {
        console.log(`Running on ${config.baseUrl}:${config.port}`);
    });
}

function initApi(): express.Application {
    const app = express();

    app.use(
        helmet({
            frameguard: {
                action: "deny",
            },
            dnsPrefetchControl: false,
        })
    );

    app.use(
        cors({
            origin: config.cors,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        })
    );

    app.use(express.urlencoded({ extended: false, limit: "50kb" }));
    app.use(express.json({ limit: "50kb" }));

    app.use(handleRequest);

    app.use(routes);

    app.use(handleNotFound);

    app.use(handleError);

    return app;
}
