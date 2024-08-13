import { Sequelize } from "sequelize";
import { Category } from "./category.model";

export interface AppSqlModel {
    Category: typeof Category;
}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    Category.initModels(sequelize);

    return {
        Category,
    };
}
