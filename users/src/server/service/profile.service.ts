import { AppRepositoryMap, UsersAuthRepository, UsersProfileRepository } from "../../contract/repository.contract";
import { ProfileService } from "../../contract/service.contract";
import { amqp } from "../../module/amqp.module";
import { UserSession } from "../../module/dto.module";
import { errorResponses } from "../../response";
import { toUnixEpoch } from "../../utils/date.utils";
import { createData, updateData } from "../../utils/helper.utils";
import { amqpQueue } from "../constant/amqp-message.constant";
import { logs } from "../constant/logs.constant";
import { LogsPayload } from "../dto/logs.dto";
import { CreateProfile_Payload, ProfileResult, UpdateProfile_Payload } from "../dto/profile.dto";
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

        if (userAuth.UsersProfile) {
            throw errorResponses.getError("E_REC_1");
        }

        const dateOfBirth = new Date(year, month, date, 12, 30, 0);

        const createdValues = createData<UsersProfileCreationAttributes>(
            {
                userAuthId: userAuth.id,
                firstName,
                lastName,
                address,
                dateOfBirth,
            },
            usersSession
        );

        const result = await this.usersProfile.insert(createdValues);

        const logsPayload: LogsPayload = {
            ip: usersSession.ip,
            userXid: usersSession.xid,
            name: logs.profile,
            data: `${usersSession.email} create their profile`,
        };

        await amqp.sendMessage(amqpQueue.logs, logsPayload);

        return composeProfile(result);
    };

    getDetail = async (payload: UserSession): Promise<ProfileResult> => {
        const { xid } = payload;

        const userProfile = await this.usersProfile.findByUserAuthXid(xid);

        if (!userProfile) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return composeProfile(userProfile);
    };

    updateProfile = async (payload: UpdateProfile_Payload): Promise<ProfileResult> => {
        const { xid, usersSession, firstName, lastName, address, version } = payload;

        const userProfile = await this.usersProfile.findByXidAndUserAuthXid(xid, usersSession.xid);

        if (!userProfile) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const updatedValues = updateData<UsersProfileAttributes>(
            userProfile,
            {
                firstName,
                lastName,
                address,
            },
            usersSession
        );

        const result = await this.usersProfile.update(userProfile.id, updatedValues, version);

        if (!result) {
            throw errorResponses.getError("E_ERR_1");
        }

        const logsPayload: LogsPayload = {
            ip: usersSession.ip,
            userXid: usersSession.xid,
            name: logs.profile,
            data: `${usersSession.email} updated their profile`,
        };

        await amqp.sendMessage(amqpQueue.logs, logsPayload);

        Object.assign(userProfile, updatedValues);

        return composeProfile(userProfile);
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
