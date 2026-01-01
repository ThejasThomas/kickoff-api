import { inject, injectable } from "tsyringe";
import { IGetTransactionDetailsUseCse } from "../../../domain/useCaseInterfaces/wallet/get_admin_transaction_details_usecase_interface";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { AdminTransactionDetailsEntity } from "../../../domain/models/admin_transaction_details_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetTrasactionDetailsUseCase
  implements IGetTransactionDetailsUseCse
{
  constructor(
    @inject("IOwnerWalletTransactionRepository")
    private _getOwnerWallettransactionRepo: IOwnerWalletTransactionRepository
  ) {}

  async execute(transactionId: string): Promise<AdminTransactionDetailsEntity> {
    const data = await this._getOwnerWallettransactionRepo.getByTransactionId(
      transactionId
    );

    if (!data) {
      throw new CustomError(
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return data;
  }
}
