import { IWalletTransaction } from "../../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model";
import { IWalletEntity } from "../../models/wallet_entity";
import { IWalletTransactionEntity } from "../../models/wallet_transaction_entity";

export interface IGetWalletHistoryUseCase{
    execute(userId:string,page:number,limit:number):Promise<{ transactions: IWalletTransactionEntity[]; total: number }>
}
