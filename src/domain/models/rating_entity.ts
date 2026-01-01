import { Types } from "mongoose";

export interface IRatingEntity{
    _id?:Types.ObjectId;

    userId:string;
    turfId:string;
    bookingId:string;

    rating:number;
    hasRated:boolean;

    createdAt?:Date;
    updatedAt?:Date;
}

export interface ITurfRatingItem {
    rating:number;
    userName:string;
    createdAt:Date;
}

export interface ITurfRatingResult {
    averageRating:number;
    totalRating:number;
    ratings:ITurfRatingItem[]
}