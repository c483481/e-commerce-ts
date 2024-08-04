import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute } from "./common";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

const tableName = "users-auth";

export interface UsersAuthAttributes extends BaseSequelizeAttribute {
    email: string;
    password: string;
    role: string;
}

export type UsersAuthCreationAttributes = Optional<UsersAuthAttributes, "id">;

export class UsersAuth extends Model<UsersAuthAttributes, UsersAuthCreationAttributes> implements UsersAuthAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    email!: string;
    role!: string;
    password!: string;

    static initModels(sequelize: Sequelize): typeof UsersAuth {
        console.log(`Initiate Modles ${tableName}`);
        return UsersAuth.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                role: {
                    type: DataTypes.STRING(5),
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
