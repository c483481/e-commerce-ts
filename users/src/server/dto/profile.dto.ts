import { BaseResult, UserSession } from "../../module/dto.module";

export interface CreateProfile_Payload {
    firstName: string;
    lastName: string;
    address: string;
    year: number;
    month: number;
    date: number;
    usersSession: UserSession;
}

export interface ProfileResult extends BaseResult {
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: string;
}

export interface UpdateProfile_Payload {
    xid: string;
    firstName: string;
    lastName: string;
    address: string;
    version: number;
    usersSession: UserSession;
}
