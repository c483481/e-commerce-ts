import { AppRepositoryMap, UsersAuthRepository } from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { bcryptModule } from "../../module/bcrypt.module";
import { errorResponses } from "../../response";
import { toUnixEpoch } from "../../utils/date.utils";
import { createData } from "../../utils/helper.utils";
import { DEFAULT_USER_ROLE } from "../constant/role.constant";
import { RegisterPayload, UsersAuthResult } from "../dto/auth.dto";
import { UsersAuthAttributes, UsersAuthCreationAttributes } from "../model/users-auth.model";
import { BaseService } from "./base.service";

export class Auth extends BaseService implements AuthService {
    private usersAuthRepo!: UsersAuthRepository;
    init(repository: AppRepositoryMap): void {
        this.usersAuthRepo = repository.usersAuth;
    }

    register = async (payload: RegisterPayload): Promise<UsersAuthResult> => {
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
    };
}