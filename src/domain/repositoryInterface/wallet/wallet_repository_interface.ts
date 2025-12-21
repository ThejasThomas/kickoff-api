import { IWalletEntity } from "../../models/wallet_entity";
import { IBaseRepository } from "../base-repository.interface";
import { IWalletTransactionEntity } from "../../models/wallet_transaction_entity";

export interface IWalletRepository extends IBaseRepository<IWalletEntity>{
    getWalletByUserId(userId: string): Promise<IWalletEntity | null>;
    createWallet(userId:string):Promise<IWalletEntity>
    createTransaction(data:IWalletEntity):Promise<void>
    getBalance(userId:string):Promise<number>
    getTransactionHistory(userId:string,page:number,limit:number):Promise<{transactions:IWalletTransactionEntity[],total:number}>
    addMoney(userId:string,amount:number,reason:string):Promise<IWalletEntity>
}   