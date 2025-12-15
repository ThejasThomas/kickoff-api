import { Types } from "mongoose";

export interface IChatMessageEntity{
    _id?:Types.ObjectId;
    groupId:string;
    senderId:string;
    text:string;
    createdAt?:Date;
}