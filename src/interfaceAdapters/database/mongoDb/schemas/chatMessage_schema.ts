import { Schema, Types } from "mongoose";


export interface IChatMessageModel {
  _id?: Types.ObjectId;
  groupId: Types.ObjectId; 
  senderId: string;
  text: string;
  createdAt?: Date;
}

export const ChatMessageSchema =new Schema<IChatMessageModel>(
    {
        groupId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"ChatGroup",
            index:true
        },
        senderId:{
            type:String,
            required:true,
            index:true
        },
        text:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:{createdAt:true,updatedAt:false}
    }
)