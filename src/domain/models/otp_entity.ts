import { ObjectId } from "mongoose";

export interface IOtpEntity {
    otp:string;
    email:string;
    expiresAt:Date;
}