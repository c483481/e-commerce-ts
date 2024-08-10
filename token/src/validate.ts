import Validator, { AsyncCheckFunction, SyncCheckFunction } from "fastest-validator";
import { errorResponses } from "./response";

const baseValidator = new Validator({
    useNewCustomCheckerFunction: true,
});

export function validate(fn: AsyncCheckFunction | SyncCheckFunction, data: unknown) {
    const err = fn(data);
    if (err !== true) {
        throw errorResponses.badError(err);
    }
}

export const validateGeneratePayload = baseValidator.compile({
    email: "email|empty:false|required|max:255",
    xid: "string|empty:false|required|min:26|max:26",
    audiance: "string|empty:true|optional|max:255",
    $$strict: true,
});
