import { ObjectId, Schema, SchemaDefinition, model } from "mongoose";
import { BaseAttribute } from "../../module/dto.module";
import { commonScema } from "./common";

export interface LogsCreationAttribute extends BaseAttribute {
    ip: string;
    name: string;
    data: string;
    userXid: string;
}

export interface LogsAttribute extends LogsCreationAttribute {
    _id: ObjectId;
}

const scema: SchemaDefinition<LogsAttribute> = {
    ip: { type: String, trim: true, required: true, max: 255 },
    name: { type: String, trim: true, required: true, max: 255 },
    data: { type: String, trim: true, required: true, max: 255 },
    userXid: { type: String, trim: true, required: true, max: 255 },
};

Object.assign(scema, commonScema);

const actualScema = new Schema<LogsAttribute>(scema, { versionKey: false });

export const Logs = model<LogsAttribute>("logs", actualScema);
