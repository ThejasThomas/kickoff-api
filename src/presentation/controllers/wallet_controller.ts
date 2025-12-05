import { inject, injectable } from "tsyringe";
import { IWalletController } from "../../domain/controllerInterfaces/wallet/wallet_controller_interface";
import { IAddMoneyUseCase } from "../../domain/useCaseInterfaces/wallet/add_money_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { success } from "zod";
import { CustomError } from "../../domain/utils/custom.error";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";
import { IGetWalletBalanceUseCase } from "../../domain/useCaseInterfaces/wallet/getWalletBalanceUseCase_interface";
import { IWalletTransaction } from "../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model";
import { IGetWalletHistoryUseCase } from "../../domain/useCaseInterfaces/wallet/get_walletHistory_usecase";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject("IAddMoneyUseCase")
    private _addMoneyUseCase: IAddMoneyUseCase,
    @inject("IGetWalletBalanceUseCase")
    private _getWalletBalanceUseCase: IGetWalletBalanceUseCase,
    @inject("IGetWalletHistoryUseCase")
    private _getWalletHistoryUseCase: IGetWalletHistoryUseCase
  ) {}

  async addMoney(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { amount, reason } = req.body;
      console.log("heylloooo its amount", amount);
      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      if (!amount || amount <= 0) {
        throw new CustomError(
          ERROR_MESSAGES.AMOUNT_MUST_BE_POSITIVE,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const result = await this._addMoneyUseCase.execute(
        userId,
        Number(amount),
        reason || "Wallet top up"
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Money added to wallet successfully",
        data: result,
      });
    } catch {
      handleErrorResponse(req, res, error);
    }
  }
  async getWalletBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId;
      console.log("userrIDDD", userId);
      const balance = await this._getWalletBalanceUseCase.execute(userId);

      res.status(200).json({
        success: true,
        balance,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Failed to fetch wallet balance",
      });
    }
  }
  async getWalletHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const { transactions, total } =
        await this._getWalletHistoryUseCase.execute(userId, page, limit);
      res.status(200).json({
        success: true,
        transactions: transactions,
        total,
        page,
        limit
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "failed to fetch wallet history",
      });
    }
  }
}
