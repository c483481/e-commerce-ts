import { baseValidator } from "./base.validator";

export class CategoryValidator {
    static CreateCategory_Payload = baseValidator.compile({
        name: "string|empty:false|required|min:2|max:255",
        $$strict: true,
    });
}
