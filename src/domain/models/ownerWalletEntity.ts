export interface IOwnerWalletEntity{
    id?:string;
    ownerId:string;
    balance:number;
    createdAt?:Date;
    updatedAt?:Date;
}