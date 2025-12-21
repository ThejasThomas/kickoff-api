import { IWalletTransactionEntity } from "../../models/wallet_transaction_entity";

export interface IGetWalletHistoryUseCase{
    execute(userId:string,page:number,limit:number):Promise<{ transactions: IWalletTransactionEntity[]; total: number }>
}
