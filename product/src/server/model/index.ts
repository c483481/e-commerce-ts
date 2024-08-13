import { Sequelize } from "sequelize";

export interface AppSqlModel {}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    return {};
}
