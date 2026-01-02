"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const email_validation_1 = require("../../../../shared/validations/email_validation");
const phone_validation_1 = require("../../../../shared/validations/phone_validation");
const password_validation_1 = require("../../../../shared/validations/password_validation");
const name_validation_1 = require("../../../../shared/validations/name_validation");
const adminSchema = zod_1.default.object({
    email: email_validation_1.strongEmailRegex,
    password: password_validation_1.passwordSchema,
    role: zod_1.default.literal('admin')
});
const clientSchema = zod_1.default.object({
    fullName: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phoneNumber: phone_validation_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    role: zod_1.default.literal('client')
});
const turfOwnerSchema = zod_1.default.object({
    ownerName: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phoneNumber: phone_validation_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    // location:z.object({
    //     name:z.string(),
    //     displayName:z.string(),
    //     zipCode:z.string(),
    // }),
    //     geoLocation:z.object({
    //         type:z.string(),
    //         coordinates:z.tuple([
    //             z.number().min(-180).max(180),//longitude
    //             z.number().min(-90).max(90),//latitude
    //         ])
    //    .refine(
    //         (coords) => coords.length === 2,
    //         "Coordinates must be [longitude, latitude]"
    //       ),
    //   }),
    status: zod_1.default.enum(["pending", "active", "blocked", "rejected"]),
    role: zod_1.default.literal("turfOwner"),
});
exports.userSchema = {
    admin: adminSchema,
    client: clientSchema,
    turfOwner: turfOwnerSchema,
};
