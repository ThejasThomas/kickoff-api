import { model } from "mongoose";
import { IWalletTransactionEntity } from "../../../../domain/models/wallet_transaction_entity";
import { WalletTransactionSchema } from "../schemas/wallet_transaction_schema";

export interface IWalletTransaction extends IWalletTransactionEntity{

}  

export const WalletTransactionModel =model<IWalletTransaction>('WalletTransaction',WalletTransactionSchema)