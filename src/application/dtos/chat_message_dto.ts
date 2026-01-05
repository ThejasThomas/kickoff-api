import { Types } from "mongoose";
export interface ReplyTo {
  messageId: string;
  senderId?: string;
  text?: string;
}

export interface IChatMessageDTO{
    _id?:Types.ObjectId;
    groupId:string;
    senderId:string;
    text:string;
    isDeleted?:boolean;
    replyTo?: ReplyTo;
    createdAt?:Date;
}