import { Types } from "mongoose";

export interface IRatingDTO{
    _id?:Types.ObjectId;

    userId:string;
    turfId:string;
    bookingId:string;

    rating:number;
    hasRated:boolean;

    createdAt?:Date;
    updatedAt?:Date;
}