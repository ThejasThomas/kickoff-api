import { ObjectId } from "mongoose";
import { statusTypes, TRole } from "../../shared/constants";

export interface IUserEntity {
    _id?:ObjectId;
    userId?:string;
    fullName:string;
    email:string;
    phoneNumber?:string;
    password:string;
    role?:TRole;
    status?:statusTypes
    createdAt?: Date;
    updatedAt?: Date;
}

