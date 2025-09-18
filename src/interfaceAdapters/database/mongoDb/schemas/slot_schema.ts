import { ISlotModel } from "../models/slot_model";
import { Schema } from "mongoose";

export const SlotSchema= new Schema<ISlotModel>({
    turfId:{
        type:String,
        ref:"Turf",
        required:true
    },
    ownerId:{
        type:String,
        required:true
    },
    date:{
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
    isBooked:{
        type:Boolean,
        default:false
    },
    duration:{
        type:Number,
    },
    price:{
        type:Number,
    }
})

SlotSchema.index(
    {turfId:1,date:1,startTime:1},
    {unique:true}
)

