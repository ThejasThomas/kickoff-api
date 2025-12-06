import { number } from "zod";
import { IWallet } from "../../../interfaceAdapters/database/mongoDb/models/wallet_model";
import { IWalletEntity } from "../../models/wallet_entity";
import { IBaseRepository } from "../base-repository.interface";
import { IWalletTransaction } from "../../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model";
import { IWalletTransactionEntity } from "../../models/wallet_transaction_entity";

export interface IWalletRepository extends IBaseRepository<IWalletEntity>{
    getWalletByUserId(userId: string): Promise<IWalletEntity | null>;
    createWallet(userId:string):Promise<IWalletEntity>
    createTransaction(data:IWalletEntity):Promise<void>
    getBalance(userId:string):Promise<number>
    getTransactionHistory(userId:string,page:number,limit:number):Promise<{transactions:IWalletTransactionEntity[],total:number}>
    addMoney(userId:string,amount:number,reason:string):Promise<IWalletEntity>
}   