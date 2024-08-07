import { AppServiceMap } from "./contract/service.contract";
import { amqp } from "./module/amqp.module";
import { CreateAuthHistory_Payload } from "./server/dto/auth-history.dto";
import { safeValidate } from "./server/validate";
import { AuthHistoryValidator } from "./server/validate/auth-history.validator";

export async function initAmqpConsumer(service: AppServiceMap): Promise<void> {
    await amqp.createConsumer<CreateAuthHistory_Payload>(
        "auth_history",
        service.authHistory.create,
        (payload: CreateAuthHistory_Payload): boolean =>
            safeValidate(AuthHistoryValidator.CreateAuthHistory_Payload, payload)
    );
}
