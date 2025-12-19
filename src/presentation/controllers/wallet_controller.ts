import { inject, injectable } from "tsyringe";
import { IWalletController } from "../../domain/controllerInterfaces/wallet/wallet_controller_interface";
import { IAddMoneyUseCase } from "../../domain/useCaseInterfaces/wallet/add_money_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { Request, Response } from "express";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { success } from "zod";
import { CustomError } from "../../domain/utils/custom.error";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";
import { IGetWalletBalanceUseCase } from "../../domain/useCaseInterfaces/wallet/getWalletBalanceUseCase_interface";
import { IWalletTransaction } from "../../interfaceAdapters/database/mongoDb/models/wallet_transaction_model";
import { IGetWalletHistoryUseCase } from "../../domain/useCaseInterfaces/wallet/get_walletHistory_usecase";
import { IGetOwnerWalletTransactionsUseCase } from "../../domain/useCaseInterfaces/wallet/get_owner_wallet_transaction_history";
import { IGetOwnerWalletUseCase } from "../../domain/useCaseInterfaces/wallet/get_owner_wallet_usecase_interface";
import { IGetAdminWalletUseCase } from "../../domain/useCaseInterfaces/wallet/get_admin_wallet_usecase_interface";
import { IAdminWalletTransactionUSeCase } from "../../domain/useCaseInterfaces/wallet/get_admin_wallet_transaction_usecase_interface";
import { IGetAllOwnerWalletTransactionsUseCase } from "../../domain/useCaseInterfaces/wallet/get_all_owners_wallet_transaction_usecase_interface";
import { IGetTransactionDetailsUseCse } from "../../domain/useCaseInterfaces/wallet/get_admin_transaction_details_usecase_interface";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject("IAddMoneyUseCase")
    private _addMoneyUseCase: IAddMoneyUseCase,
    @inject("IGetWalletBalanceUseCase")
    private _getWalletBalanceUseCase: IGetWalletBalanceUseCase,
    @inject("IGetWalletHistoryUseCase")
    private _getWalletHistoryUseCase: IGetWalletHistoryUseCase,
    @inject("IGetOwnerWalletTransactionsUseCase")
    private _getOwnerWalletTransactionUsecase: IGetOwnerWalletTransactionsUseCase,
    @inject("IGetOwnerWalletUseCase")
    private _getOwnerWalletUseCase: IGetOwnerWalletUseCase,
    @inject("IGetAdminWalletUseCase")
    private _getAdminWalletUseCase: IGetAdminWalletUseCase,
    @inject("IAdminWalletTransactionUSeCase")
    private _getAdminWalletTransactionUseCase: IAdminWalletTransactionUSeCase,
    @inject("IGetAllOwnerWalletTransactionsUseCase")
    private _getAllOwnersTransactionsUsecase:IGetAllOwnerWalletTransactionsUseCase,
    @inject("IGetTransactionDetailsUseCse")
    private _getTrasactionDetailsUseCase:IGetTransactionDetailsUseCse
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
        limit,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "failed to fetch wallet history",
      });
    }
  }
  async getOwnerWalletTransactions(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this._getOwnerWalletTransactionUsecase.execute(
        ownerId,
        page,
        limit
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.WALLET_TRANSACTION_FETCHED,
        ...result,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.WALLET_TRANSACTION_FETCH_FAILED,
      });
    }
  }
  async getOwnerWallet(req: Request, res: Response): Promise<void> {
    const ownerId = (req as CustomRequest).user?.userId;

    const wallet = await this._getOwnerWalletUseCase.execute(ownerId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      wallet,
    });
  }
  async getAdminwallet(req: Request, res: Response): Promise<void> {
    const wallet = await this._getAdminWalletUseCase.execute();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      wallet,
    });
  }
  async getAdminWalletTransactions(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit) || 10;

    const result =await this._getAdminWalletTransactionUseCase.execute(page,limit)

    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:SUCCESS_MESSAGES.ADMIN_WALLET_FETCHED_SCCESSFULLY,
      ...result
    })
  }

  async getAllOwnersTransactions(req: Request, res: Response): Promise<void> {
    try{
      const page =Number(req.query.page)||1;
      const limit =Number(req.query.limit) || 10;

      const data = await this._getAllOwnersTransactionsUsecase.execute(page,limit)
      console.log('data',data)

      res.status(HTTP_STATUS.OK).json({
        success:true,
        ...data
      })
    }catch(error){
      handleErrorResponse(req,res,error)
    }
  }
  async getTransactionDetails(req: Request, res: Response): Promise<void> {
    try{
      const {transactionId}=req.params;

      const data = await this._getTrasactionDetailsUseCase.execute(transactionId)

      res.status(HTTP_STATUS.OK).json({
        success:true,
        data,
      })
    }catch(error){
      handleErrorResponse(req,res,error)
    }
  }
}
