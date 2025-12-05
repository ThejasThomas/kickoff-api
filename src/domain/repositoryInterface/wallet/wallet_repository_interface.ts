import { number } from "zod";
import { IWallet } from "../../../interfaceAdapters/database/mongoDb/models/wallet_model";
import { IWalletEntity } from "../../models/wallet_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletRepository extends IBaseRepository<IWalletEntity>{
    getWalletByUserId(userId: string): Promise<IWalletEntity | null>;
    createWallet(userId:string,amount:number):Promise<IWallet>
    createTransaction(data:IWalletEntity):Promise<void>
    getBalance(userId:string):Promise<number>
    getTransactionHistory(userId:string,page:number,limit:number):Promise<{transactions:IWalletEntity[],total:number}>
}   