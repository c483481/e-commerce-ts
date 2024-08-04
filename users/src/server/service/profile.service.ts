import { AppRepositoryMap, UsersAuthRepository, UsersProfileRepository } from "../../contract/repository.contract";
import { ProfileService } from "../../contract/service.contract";
import { errorResponses } from "../../response";
import { toUnixEpoch } from "../../utils/date.utils";
import { createData } from "../../utils/helper.utils";
import { CreateProfile_Payload, ProfileResult } from "../dto/profile.dto";
import { UsersProfileAttributes, UsersProfileCreationAttributes } from "../model/user-profile.model";
import { BaseService } from "./base.service";

export class Profile extends BaseService implements ProfileService {
    private usersProfile!: UsersProfileRepository;
    private usersAuth!: UsersAuthRepository;

    init(repository: AppRepositoryMap): void {
        this.usersProfile = repository.usersProfile;
        this.usersAuth = repository.usersAuth;
    }

    createProfile = async (payload: CreateProfile_Payload): Promise<ProfileResult> => {
        const { firstName, lastName, address, year, month, date, usersSession } = payload;

        const userAuth = await this.usersAuth.findByXid(usersSession.xid);

        if (!userAuth) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const dateOfBirth = new Date(year, month, date, 12, 30, 0);

        const createdValues = createData<UsersProfileCreationAttributes>({
            userAuthId: userAuth.id,
            firstName,
            lastName,
            address,
            dateOfBirth,
        });

        const result = await this.usersProfile.insert(createdValues);

        return composeProfile(result);
    };
}

export function composeProfile(row: UsersProfileAttributes): ProfileResult {
    return {
        xid: row.xid,
        firstName: row.firstName,
        lastName: row.lastName,
        address: row.address,
        dateOfBirth: `${row.dateOfBirth.getFullYear()}-${row.dateOfBirth.getMonth()}-${row.dateOfBirth.getDate()}`,
        modifiedBy: row.modifiedBy,
        version: row.version,
        updatedAt: toUnixEpoch(row.updatedAt),
        createdAt: toUnixEpoch(row.createdAt),
    };
}
