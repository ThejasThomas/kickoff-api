import { Schema } from "mongoose";
import { IBookingModel } from "../models/booking_model";

export const BookingSchema =new Schema<IBookingModel>({
    userId:{
        type:String,
        required:true
    },
    turfId:{
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    }

})
