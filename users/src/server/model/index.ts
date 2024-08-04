import { Sequelize } from "sequelize";
import { UsersAuth } from "./users-auth.model";
import { UsersProfile } from "./user-profile.model";

export interface AppSqlModel {
    UsersAuth: typeof UsersAuth;
    UsersProfile: typeof UsersProfile;
}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    UsersAuth.initModels(sequelize);
    UsersProfile.initModels(sequelize);

    return {
        UsersAuth,
        UsersProfile,
    };
}
