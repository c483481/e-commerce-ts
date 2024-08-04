import { baseValidator } from "./base.validator";

export class AuthValidator {
    static RegisterPayload = baseValidator.compile({
        email: "email|empty:false|required|max:255",
        password: "string|empty:false|required|min:5|max:255",
        $$strict: true,
    });
}
