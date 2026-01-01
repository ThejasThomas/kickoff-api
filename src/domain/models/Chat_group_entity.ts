import { Types } from "mongoose";

export interface IChatGroupEntity{
    _id?:Types.ObjectId;
    hostedGameId:string;
    name:string;
    adminId:string;
    members:string[];
    createdAt?:Date;
    updatedAt?:Date;
}
