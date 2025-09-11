import z from "zod";
import { ERROR_MESSAGES } from "../../../../shared/constants";
import { passwordSchema } from "../../../../shared/validations/password_validation";

export const resetPasswordValidationSchema = z.object({
	password: passwordSchema,
	token: z.string(),
	role: z.enum(["client", "admin", "turfOwner"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});
