import { AdminTransactionDetailsEntity } from "../../models/admin_transaction_details_entity";

export interface IGetTransactionDetailsUseCse{
    execute(transactionId:string):Promise<AdminTransactionDetailsEntity>
}