import { Types } from "mongoose";

export interface IHostedGameEntity{
    _id?: Types.ObjectId;
    hostUserId:string;
    turfId:string;
    courtType:string;
    slotDate:string;
    startTime:string;
    endTime:string;
    gameStartAt:Date,
    pricePerPlayer:number;
    capacity:number;

    status:"open"|"full"|"cancelled"|"completed";

    players?:{
        userId:string;
        status:"pending"|"paid"|"cancelled";
        paymentId?:string;
        joinedAt?:string;
    }[]

    createdAt?:Date;
    updatedAt?:Date;
}