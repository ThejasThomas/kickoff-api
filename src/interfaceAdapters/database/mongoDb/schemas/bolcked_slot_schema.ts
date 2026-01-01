import mongoose, { Document, Schema } from "mongoose";

export interface IBlockedModel extends Document {
  turfId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
  createdAt: Date;
}

const blockedSlotSchema=new Schema<IBlockedModel>(
    {
        turfId:{
            type:Schema.Types.ObjectId,
            ref:"Turf",
            required:true,
        },
        date:{type:String,required:true},
        startTime:{type:String,required:true},
        endTime:{type:String,required:true},
        reason:{type:String},
    },
    {timestamps:true}
)

export const BlockedSlotModel =mongoose.model<IBlockedModel>(
    "BlockedSlot",
    blockedSlotSchema
)