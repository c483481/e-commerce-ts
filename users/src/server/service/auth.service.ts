import { isValid } from "ulidx";
import { AppRepositoryMap, UsersAuthRepository } from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { bcryptModule } from "../../module/bcrypt.module";
import { errorResponses } from "../../response";
import { toUnixEpoch } from "../../utils/date.utils";
import { createData } from "../../utils/helper.utils";
import { DEFAULT_USER_ROLE } from "../constant/role.constant";
import { AuthHistoryPayload, AuthPayload, AuthResult, RefreshTokenResult, UsersAuthResult } from "../dto/auth.dto";
import { UsersAuthAttributes, UsersAuthCreationAttributes } from "../model/users-auth.model";
import { BaseService } from "./base.service";
import { composeProfile } from "./profile.service";
import { amqp } from "../../module/amqp.module";
import { amqpQueue } from "../constant/amqp-message.constant";
import { LogsPayload } from "../dto/logs.dto";
import { logs } from "../constant/logs.constant";
import { tokenModule } from "../../module/token.module";

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
        const { email, password, ip } = payload;

        const userAuth = await this.usersAuthRepo.findByEmail(email);

        if (!userAuth) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const verify: boolean = await bcryptModule.compare(password, userAuth.password);

        if (!verify) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const authHistoryPayload: AuthHistoryPayload = {
            ip,
            userXid: userAuth.xid,
        };

        const logsPayload: LogsPayload = {
            ip,
            userXid: userAuth.xid,
            name: logs.loggedIn,
            data: `${userAuth.email} logged in`,
        };

        const [token] = await Promise.all([
            tokenModule.generateToken(userAuth.xid, userAuth.email, userAuth.role),
            amqp.sendMessage(amqpQueue.authHistory, authHistoryPayload),
            amqp.sendMessage(amqpQueue.logs, logsPayload),
        ]);

        if (!token) {
            throw errorResponses.getError("E_SER_1");
        }

        const result = composeUsersAuth(userAuth) as AuthResult;

        result.token = token;

        return result;
    };

    refreshToken = async (xid: string): Promise<RefreshTokenResult> => {
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const userAuth = await this.usersAuthRepo.findByXid(xid);

        if (!userAuth) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const result = composeUsersAuth(userAuth) as RefreshTokenResult;

        const token = await tokenModule.generateAccessToken(userAuth.xid, userAuth.email, userAuth.role);

        if (!token) {
            throw errorResponses.getError("E_SER_1");
        }

        result.token = token;

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
