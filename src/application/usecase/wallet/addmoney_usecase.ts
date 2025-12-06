import { inject, injectable } from "tsyringe";
import { IAddMoneyUseCase } from "../../../domain/useCaseInterfaces/wallet/add_money_usecase_interface";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import {
  IWalletEntity,
  WalletTransactionStatus,
  WalletTransactionType,
} from "../../../domain/models/wallet_entity";
import { IWallet } from "../../../interfaceAdapters/database/mongoDb/models/wallet_model";

@injectable()
export class AddMoneyUseCase implements IAddMoneyUseCase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string, amount: number, reason: string):Promise<{ success: boolean; balance: number }> {
    try {
      if (!amount || amount <= 0) {
        throw new CustomError(
          ERROR_MESSAGES.AMOUNT_MUST_BE_POSITIVE,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const wallet=await this._walletRepository.addMoney(
        userId,
        amount,
        reason
      )

      return {
        success: true,
        balance:wallet.balance
      };
    } catch (err) {
      console.log(err);

      throw new CustomError(
        ERROR_MESSAGES.WALLET_TRANSACTION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
