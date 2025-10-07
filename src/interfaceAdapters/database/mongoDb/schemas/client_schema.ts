import { Schema } from "mongoose";
import { IClientModel } from "../models/client_model";

export const clientSchema = new Schema<IClientModel>(
  {
    userId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "client" },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
    },
    googleId: { type: String },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        // default: "Point",
      },
      coordinates: {
        type: [Number], 
      },
    },
    location: {
      name: { type: String },
      displayName: { type: String },
      zipCode: { type: String },
    },
  },
  { timestamps: true }
);

clientSchema.index({ geoLocation: "2dsphere" });
