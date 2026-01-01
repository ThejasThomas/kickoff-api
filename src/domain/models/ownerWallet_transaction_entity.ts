import { Types } from "mongoose";

export enum OwnerWalletTransactionType {
    CREDIT ="CREDIT",
    DEBIT ="DEBIT"
}


export enum OwnerWalletTransactionStatus{
    SUCCESS ="SUCCESS",
    FAILED ="FAILED"
}

export interface IOwnerWalletTransactionEntity{
    id?:string;
    ownerId:string;
    turfId:Types.ObjectId
    bookingId?:Types.ObjectId
    hostedGameId?:string;

    type:OwnerWalletTransactionType;
    amount:number;

    reason:string;
    status:OwnerWalletTransactionStatus;

    transactionDate:Date;
    createdAt?:Date
}