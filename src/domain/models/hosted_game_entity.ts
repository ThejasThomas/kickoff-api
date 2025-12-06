export interface IHostedGameEntity{
    id?:string;
    hostUserId:string;
    turfId:string;
    courtType:string;
    slotDate:string;
    startTime:string;
    endTime:string;
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