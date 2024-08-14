import { AsyncCheckFunction, SyncCheckFunction } from "fastest-validator";
import { errorResponses } from "../../response";
import { UploadedFile } from "express-fileupload";

export function validate(fn: AsyncCheckFunction | SyncCheckFunction, data: unknown) {
    const err = fn(data);
    if (err !== true) {
        throw errorResponses.badError(err);
    }
}

export function isValidImage(payload: unknown): UploadedFile | null {
    if (!payload) {
        return null;
    }

    if (typeof payload !== "object" || !("image" in payload)) {
        return null;
    }

    if (!isValidUploadedFile(payload.image)) {
        return null;
    }

    if (!["image/jpeg", "image/png"].includes(payload.image.mimetype)) {
        return null;
    }

    return payload.image;
}

function isValidUploadedFile(obj: unknown): obj is UploadedFile {
    return (
        obj != null &&
        typeof obj == "object" &&
        "name" in obj &&
        typeof obj.name === "string" &&
        "mv" in obj &&
        typeof obj.mv === "function" &&
        "encoding" in obj &&
        typeof obj.encoding === "string" &&
        "mimetype" in obj &&
        typeof obj.mimetype === "string" &&
        "data" in obj &&
        Buffer.isBuffer(obj.data) &&
        "tempFilePath" in obj &&
        typeof obj.tempFilePath === "string" &&
        "truncated" in obj &&
        typeof obj.truncated === "boolean" &&
        "size" in obj &&
        typeof obj.size === "number" &&
        "md5" in obj &&
        typeof obj.md5 === "string"
    );
}
