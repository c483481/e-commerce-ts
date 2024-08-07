import { LOGS } from "../constant/logs.constant";
import { baseValidator } from "./base.validator";

export class LogsValidator {
    static CreateLogs_Payload = baseValidator.compile({
        ip: "string|required|empty:false|min:3|max:32",
        name: {
            type: "enum",
            values: LOGS,
            require: true,
        },
        data: "string|empty:false|required|min:3|max:255",
        userXid: "string|required|empty:false|min:26|max:26",
        $$strict: true,
    });
}
