import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";
import { handleError, handleNotFound, handleRequest } from "./handler";
import { Controller } from "./server/controller";
import { AppDataSource, datasource } from "./module/datasource.module";
import { Repository } from "./server/repository";
import { AppRepositoryMap } from "./contract/repository.contract";
import { Service } from "./server/service";
import { AppServiceMap } from "./contract/service.contract";
import { errorResponses } from "./response";
import { bucket } from "./constant/minio.constant";
import { minioModule } from "./module/minio.module";
import { amqp } from "./module/amqp.module";

start();

function initRepository(dataSource: AppDataSource): AppRepositoryMap {
    const repository = new Repository();
    repository.init(dataSource);
    return repository;
}

function initService(repository: AppRepositoryMap): AppServiceMap {
    const services = new Service();
    services.init(repository);
    return services;
}

async function initSource() {
    return Promise.all([
        datasource.init(config),
        minioModule.init(
            {
                endPoint: config.minioEndpoint,
                port: config.minioPort,
                useSSL: config.minioSSL,
                accessKey: config.minioAccessKey,
                secretKey: config.minioSecretKey,
            },
            Object.values(bucket)
        ),
        amqp.init(config.amqpUri),
    ]);
}

async function start(): Promise<void> {
    errorResponses.init();

    const [source] = await initSource();

    const repository = initRepository(source);

    const service = initService(repository);

    const app = initApi(service);
    app.listen(config.port, () => {
        console.log(`Running on ${config.baseUrl}:${config.port}`);
    });
}

function initApi(service: AppServiceMap): express.Application {
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

    const controller = new Controller();

    app.use(controller.init(service));

    app.use(handleNotFound);

    app.use(handleError);

    return app;
}
