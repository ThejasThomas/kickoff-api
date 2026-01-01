import { Schema } from "mongoose";
import { IRatingEntity } from "../../../../domain/models/rating_entity";

export const RatingSchema =new Schema<IRatingEntity>(
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
            index:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        hasRated:{
            type:Boolean,
            default:true
        }
    },
    {timestamps:true}
)