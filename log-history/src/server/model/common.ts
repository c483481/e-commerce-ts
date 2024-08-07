import { SchemaDefinition } from "mongoose";
import { BaseAttribute } from "../../module/dto.module";

export const commonScema: SchemaDefinition<BaseAttribute> = {
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    version: { type: Number, required: true, min: 1 },
    modifiedBy: { type: Object, require: true },
};
