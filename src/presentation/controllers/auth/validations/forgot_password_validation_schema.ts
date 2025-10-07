import z from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email_validation";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export const forgotPasswordValidationSchema =z.object({
    email:strongEmailRegex,
    role:z.enum(['client','admin','turfOwner'],{
        message:ERROR_MESSAGES.INVALID_ROLE,
    }),

})
