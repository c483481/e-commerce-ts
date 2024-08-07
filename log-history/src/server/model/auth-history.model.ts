import { ObjectId, Schema, SchemaDefinition, model } from "mongoose";
import { BaseAttribute } from "../../module/dto.module";
import { commonScema } from "./common";

export interface AuthHistoryCreationAttribute extends BaseAttribute {
    ip: string;
    userXid: string;
}

export interface AuthHistoryAttribute extends AuthHistoryCreationAttribute {
    _id: ObjectId;
}

const scema: SchemaDefinition<AuthHistoryAttribute> = {
    ip: { type: String, trim: true, required: true, max: 255 },
    userXid: { type: String, trim: true, required: true, max: 255 },
};

Object.assign(scema, commonScema);

const actualScema = new Schema<AuthHistoryAttribute>(scema, { versionKey: false });

export const AuthHistory = model<AuthHistoryAttribute>("auth_history", actualScema);
