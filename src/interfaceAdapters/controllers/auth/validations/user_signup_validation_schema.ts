import z, { email } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email_validation";
import { phoneNumberSchema } from "../../../../shared/validations/phone_validation";
import { passwordSchema } from "../../../../shared/validations/password_validation";
import { nameSchema } from "../../../../shared/validations/name_validation";

const adminSchema=z.object({
    email:strongEmailRegex,
    password:passwordSchema,
    role:z.literal('admin')
})
const clientSchema=z.object({
    fullName:nameSchema,
    email:strongEmailRegex,
    phoneNumber:phoneNumberSchema,
    password:passwordSchema,
    role:z.literal('client')
})

const turfOwnerSchema=z.object({
    turfName:nameSchema,
    email:strongEmailRegex,
    phoneNumber:phoneNumberSchema,
    password:passwordSchema,
    location:z.object({
        name:z.string(),
        displayName:z.string(),
        zipCode:z.string(),
    }),
    geoLocation:z.object({
        type:z.string(),
        coordinates:z.tuple([
            z.number().min(-180).max(180),//longitude
            z.number().min(-90).max(90),//latitude
        ])
   .refine(
        (coords) => coords.length === 2,
        "Coordinates must be [longitude, latitude]"
      ),
  }),
  status: z.enum(["pending", "active", "blocked"]),
  role: z.literal("turfOwner"),
});

export const userSchema = {
    admin:adminSchema,
    client:clientSchema,
    turfOwner:turfOwnerSchema,
};