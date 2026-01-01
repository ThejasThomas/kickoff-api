import { ITurf } from "../models/turf_model";
import { Schema } from "mongoose";

export const TurfSchema =new Schema<ITurf>(
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
          type: [Number],
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
    openingTime:{
      type:String,
      required:false,
    },
    closingTime:{
      type:String,
      required:false
    },
    slotDuration:{
      type:String,
      required:false
    }
    
  },
  {
    timestamps: true, 
  }
)
TurfSchema.index({ "location.coordinates": "2dsphere" });

