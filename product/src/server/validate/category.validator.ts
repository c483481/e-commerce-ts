import { baseValidator } from "./base.validator";

export class CategoryValidator {
    static CreateCategory_Payload = baseValidator.compile({
        name: "string|empty:false|required|min:2|max:255",
        $$strict: true,
    });

    static UpdateCategory_Payload = baseValidator.compile({
        xid: "string|empty:false|required|min:26|max:26",
        name: "string|empty:false|required|min:2|max:255",
        version: {
            type: "any",
            nullable: false,
            validators: [
                (value: unknown) => {
                    if (typeof value === "number") {
                        return true;
                    } else if (typeof value === "string" && !isNaN(Number(value))) {
                        return true;
                    } else {
                        return "The value must be a number or a string of numbers";
                    }
                },
            ],
        },
        $$strict: true,
    });
}
