import { required } from "zod/v4/core/util.cjs";
import { ITurf } from "../models/turf_model";
import { trim } from "zod";
import { model, Schema } from "mongoose";

const TurfSchema =new Schema<ITurf>(
  {
    ownerId:{
      type:String,
      required:true,
      trim:true,
    },
    turfName:{
      type:String,
      required:true,
      trim:true
    },
     description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    amenities:{
      type:[String],
      default:[],
    },
    images: {
      type:[String],
      default:[],
    },contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerHour: {
      type: String,
      required: true,
    },
    courtType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },
    
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
)
TurfSchema.index({ "location.coordinates": "2dsphere" });

export const TurfModel = model<ITurf>("Turf", TurfSchema);
