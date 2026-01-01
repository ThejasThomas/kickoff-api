import { IOwnerWalletTransactionEntity } from "../../models/ownerWallet_transaction_entity";

export interface IGetAllOwnerWalletTransactionsUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    transactions: IOwnerWalletTransactionEntity[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}