import { Sequelize } from "sequelize";
import { UsersAuth } from "./users-auth.model";

export interface AppSqlModel {
    UsersAuth: typeof UsersAuth;
}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    UsersAuth.initModels(sequelize);

    return {
        UsersAuth,
    };
}
