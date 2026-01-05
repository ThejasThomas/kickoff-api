import { IWalletTransactionDTO } from "../../../application/dtos/wallet_transaction_dto";

export interface IGetWalletHistoryUseCase{
    execute(userId:string,page:number,limit:number):Promise<{ transactions: IWalletTransactionDTO[]; total: number }>
}
