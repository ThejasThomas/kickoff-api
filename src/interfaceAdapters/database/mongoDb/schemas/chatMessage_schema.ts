import { Schema, Types } from "mongoose";


export interface IChatMessageModel {
  _id?: Types.ObjectId;
  groupId: Types.ObjectId; 
  senderId: string;
  text: string;
  isDeleted?:boolean;
  replyTo?:{
    messageId?:Types.ObjectId;
    senderId?:string;
    text?:string
  };
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
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        replyTo:{
            messageId:{
                type:Schema.Types.ObjectId,
                ref:"ChatMessage"
            },
            senderId:{
                type:String
            },
            text:{
                type:String
            }
        }
    },
    {
        timestamps:{createdAt:true,updatedAt:false}
    }
)