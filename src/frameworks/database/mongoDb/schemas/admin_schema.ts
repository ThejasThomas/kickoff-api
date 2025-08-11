import { Schema } from "mongoose";
import { IAdminModel } from "../models/admin_model";

export const adminSchema = new Schema<IAdminModel>(
	{
		userId: { type: String, required: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phoneNumber: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: "admin" },
		status: { type: String, default: "active" },
	},
	{
		timestamps: true,
	}
);