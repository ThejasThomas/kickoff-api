import { inject, injectable } from "tsyringe";
import { IGetAllOwnerWalletTransactionsUseCase } from "../../../domain/useCaseInterfaces/wallet/get_all_owners_wallet_transaction_usecase_interface";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { IOwnerWalletTransactionEntity } from "../../../domain/models/ownerWallet_transaction_entity";

@injectable()
export class GetAllOwnersWalletTransactionUseCase
  implements IGetAllOwnerWalletTransactionsUseCase
{
  constructor(
    @inject("IOwnerWalletTransactionRepository")
    private _ownerTransactionRepo: IOwnerWalletTransactionRepository
  ) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{
    transactions: IOwnerWalletTransactionEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    console.log("heyy bro")
    const { transactions, total } =
      await this._ownerTransactionRepo.getPaginated(page, limit);
      console.log('transaction',transactions)

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
