import { baseValidator } from "./base.validator";

export class AuthHistoryValidator {
    static CreateAuthHistory_Payload = baseValidator.compile({
        ip: "string|required|empty:false|min:3|max:32",
        userXid: "string|required|empty:false|min:26|max:26",
        $$strict: true,
    });
}
