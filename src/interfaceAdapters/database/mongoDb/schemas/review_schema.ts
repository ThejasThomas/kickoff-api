import { Schema } from "mongoose";
import { IReviewEntity } from "../../../../domain/models/review_entity";

export const ReviewSchema =new Schema<IReviewEntity>(
    {
        userId:{
            type:String,
            required:true,
            index:true
        },
        turfId:{
            type:String,
            required:true,
            index:true
        },
        bookingId:{
            type:String,
            required:true,
            unique:true,
            index:true,

        },
        comment:{
            type:String,
            required:true,
            trim:true,
            maxlength:500,
        }
    },
    {timestamps:true}
)