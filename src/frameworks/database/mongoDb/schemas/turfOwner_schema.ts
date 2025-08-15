import { Schema } from "mongoose";
import { ITurfOwnerModel } from "../models/turfOwner_model";

export const turfOwnerSchema = new Schema<ITurfOwnerModel>({
  userId: { type: String, unique: true },
  ownerName: { type: String },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "turfOwner" },
  status: {
    type: String,
    enum: ["active", "blocked", "pending"],
    default: "pending",
  },
  // description: { type: String },
  googleId: { type: String },


  // geoLocation: {
  //     type: {
  //       type: String,
  //       enum: ["Point"],
  //       default: "Point",
  //     },
  //     coordinates: {
  //       type: [Number], // [longitude, latitude]
  //       required: true,
  //     },
  //     location: {
  //     name: { type: String },
  //     displayName: { type: String },
  //     zipCode: { type: String },
  //   },
  // }
},
{timestamps:true}
);
