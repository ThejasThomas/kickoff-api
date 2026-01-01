import { IGetOwnerWalletTransactionEntity } from "../../models/getownerWalletTransaction_entity";

export interface IGetOwnerWalletTransactionsUseCase {
  execute(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: IGetOwnerWalletTransactionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
