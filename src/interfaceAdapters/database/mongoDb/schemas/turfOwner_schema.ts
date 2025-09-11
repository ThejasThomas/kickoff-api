import { Schema } from "mongoose";
import { ITurfOwnerModel } from "../models/turfOwner_model";

export const turfOwnerSchema = new Schema<ITurfOwnerModel>(
  {
    userId: { type: String, unique: true },
    ownerName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "turfOwner" },
    status: {
      type: String,
      enum: ["active", "blocked", "pending","updated"],
      default: "pending",
    },
    googleId: { type: String },
    profileImage: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
  },
  { timestamps: true }
);
