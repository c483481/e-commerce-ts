import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute } from "./common";
import { UsersAuth } from "./users-auth.model";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

const tableName = "users-profile";

export interface UsersProfileAttributes extends BaseSequelizeAttribute {
    userAuthId: number | null;
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: Date;
    UsersAuth?: UsersAuth;
}

export type UsersProfileCreationAttributes = Optional<UsersProfileAttributes, "id">;

export class UsersProfile
    extends Model<UsersProfileAttributes, UsersProfileCreationAttributes>
    implements UsersProfileAttributes
{
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    userAuthId!: number | null;
    firstName!: string;
    lastName!: string;
    address!: string;
    dateOfBirth!: Date;

    static initModels(sequelize: Sequelize): typeof UsersProfile {
        console.log(`Initiate Modles ${tableName}`);
        return UsersProfile.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                userAuthId: {
                    type: DataTypes.BIGINT,
                    unique: true,
                    allowNull: false,
                    references: {
                        model: UsersAuth,
                        key: "id",
                    },
                },
                firstName: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                dateOfBirth: {
                    type: DataTypes.DATE,
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
