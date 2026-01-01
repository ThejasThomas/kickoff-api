import { model, Schema } from "mongoose";
import { IChatGroupEntity } from "../../../../domain/models/Chat_group_entity";

export const chatGroupSchema = new Schema<IChatGroupEntity>(
    {
        hostedGameId:{
            type:String,
            required:true,
            ref:"HostedGame",
            unique:true
        },
        name:{
            type:String,
            required:true,
            trim:true,
            maxlength:50
        },
        adminId:{
            type:String,
            required:true
        },
        members:{
            type:[String],
            required:true,
            default:[]
        }

    },
    {
        timestamps:true
    }
);

export const ChatGroupModel =model<IChatGroupEntity>(
    "ChatGroup",
    chatGroupSchema
)