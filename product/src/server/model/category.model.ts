import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute } from "./common";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

const tableName = "category";

export interface CategoryAttributes extends BaseSequelizeAttribute {
    name: string;
    path: string;
    active: boolean;
}

export type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    name!: string;
    path!: string;
    active!: boolean;
    static initModels(sequelize: Sequelize): typeof Category {
        console.log(`Initiate Modles ${tableName}`);
        return Category.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                path: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: tableName,
                timestamps: false,
            }
        );
    }
}
