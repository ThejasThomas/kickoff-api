import { Types } from "mongoose";

export interface IReviewDTO{
    _id?: Types.ObjectId;   
    userId:string,
    turfId:string;
    bookingId:string;
    comment:string;
    createdAt?:Date;
    updatedAt?:Date;
}