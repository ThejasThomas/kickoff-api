import { IAdminWalletTransactionDTO } from "../../../application/dtos/admin_wallet_transaction_dto";

export interface IAdminWalletTransactionUSeCase{
    execute(page:number,limit:number):Promise<IAdminWalletTransactionDTO>
}