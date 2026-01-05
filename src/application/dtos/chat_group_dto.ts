import { Types } from "mongoose";

export interface IChatGroupDTO{
    _id?:Types.ObjectId;
    hostedGameId:string;
    name:string;
    adminId:string;
    members:string[];
    createdAt?:Date;
    updatedAt?:Date;
}
