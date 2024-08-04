import { baseValidator } from "./base.validator";
import { isValidDate } from "../../utils/date.utils";

export class ProfileValidator {
    static CreateProfile_Payload = baseValidator.compile({
        firstName: "string|empty:false|required|min:3|max:100",
        lastName: "string|empty:false|required|min:3|max:100",
        address: "string|empty:false|required|min:3|max:255",
        year: {
            type: "number",
            custom: (value: number, errors: unknown[]): unknown => {
                const minYear = new Date().getFullYear() - 17;
                if (value < 1900 || value > minYear) {
                    errors.push({ type: "year", field: "year", message: `Year must be between 1900 and ${minYear}` });
                    return errors;
                }
                return value;
            },
        },
        month: "number|empty:false|required|min:1|max:12",
        date: {
            type: "number",
            custom: (
                value: number,
                errors: unknown[],
                _scema: unknown,
                _name: unknown,
                _parent: any,
                context: unknown
            ): unknown => {
                const { data } = context as {
                    data: { year: number | null; month: number | null; date: number | null };
                };
                if (data.year && data.month && data.date) {
                    if (!isValidDate(data.year, data.month, data.date)) {
                        errors.push({
                            type: "date",
                            field: "date",
                            message: "Invalid date for the given month and year",
                        });
                        return errors;
                    }
                }
                return value;
            },
        },
        $$strict: true,
    });
}
