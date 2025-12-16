import { IOwnerWalletEntity } from "../../models/ownerWalletEntity";

export interface IOwnerWalletRepository{
    findByOwnerId(ownerId:string):Promise<IOwnerWalletEntity | null>
    create(ownerId:string):Promise<IOwnerWalletEntity>
    incrementBalance(ownerId:string,amount:number):Promise<void>
    decrementBalance(ownerId:string,amount:number):Promise<void>
}