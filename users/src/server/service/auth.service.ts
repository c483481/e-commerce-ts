import { AppRepositoryMap, UsersAuthRepository } from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { bcryptModule } from "../../module/bcrypt.module";
import { jwtModule } from "../../module/jwt.module";
import { errorResponses } from "../../response";
import { toUnixEpoch } from "../../utils/date.utils";
import { createData } from "../../utils/helper.utils";
import { DEFAULT_USER_ROLE } from "../constant/role.constant";
import { AuthPayload, AuthResult, UsersAuthResult } from "../dto/auth.dto";
import { UsersAuthAttributes, UsersAuthCreationAttributes } from "../model/users-auth.model";
import { BaseService } from "./base.service";
import { composeProfile } from "./profile.service";

export class Auth extends BaseService implements AuthService {
    private usersAuthRepo!: UsersAuthRepository;
    init(repository: AppRepositoryMap): void {
        this.usersAuthRepo = repository.usersAuth;
    }

    register = async (payload: AuthPayload): Promise<UsersAuthResult> => {
        const { email, password } = payload;

        const userAuth = await this.usersAuthRepo.findByEmail(email);

        if (userAuth) {
            throw errorResponses.getError("E_AUTH_4");
        }

        const newPassword = await bcryptModule.hash(password);

        const createdValues = createData<UsersAuthCreationAttributes>({
            email,
            password: newPassword,
            role: DEFAULT_USER_ROLE,
        });

        const result = await this.usersAuthRepo.insert(createdValues);

        return composeUsersAuth(result);
    };

    login = async (payload: AuthPayload): Promise<AuthResult> => {
        const { email, password } = payload;

        const userAuth = await this.usersAuthRepo.findByEmail(email);

        if (!userAuth) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const verify: boolean = await bcryptModule.compare(password, userAuth.password);

        if (!verify) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const token = jwtModule.issue(
            {
                xid: userAuth.xid,
                email: userAuth.email,
            },
            userAuth.role
        );

        const refreshToken = jwtModule.issueRefresh(userAuth.xid, userAuth.role);

        const result = composeUsersAuth(userAuth) as AuthResult;

        result.token = {
            accessToken: token,
            refreshToken,
        };

        return result;
    };
}

export function composeUsersAuth(row: UsersAuthAttributes): UsersAuthResult {
    return {
        xid: row.xid,
        email: row.email,
        role: row.role,
        version: row.version,
        modifiedBy: row.modifiedBy,
        updatedAt: toUnixEpoch(row.updatedAt),
        createdAt: toUnixEpoch(row.createdAt),
        usersProfile: row.UsersProfile ? composeProfile(row.UsersProfile) : null,
    };
}
