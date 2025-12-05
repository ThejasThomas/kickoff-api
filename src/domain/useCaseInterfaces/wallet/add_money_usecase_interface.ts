import { IWallet } from "../../../interfaceAdapters/database/mongoDb/models/wallet_model";

export interface IAddMoneyUseCase{
    execute(userId:string,amount:number,reason:string):Promise<{success:boolean,balance:number}>
}