import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { IWallet } from "../../database/mongoDb/models/wallet_model";
import { WalletModel } from "../../database/mongoDb/schemas/wallet_schema";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { IWalletEntity } from "../../../domain/models/wallet_entity";
import { WalletTransactionModel } from "../../database/mongoDb/models/wallet_transaction_model";

@injectable()
export class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel);
  }
  async findByUserId(userId: string) {
    return WalletModel.findOne({ userId });
  }
  async getWalletByUserId(userId: string): Promise<IWalletEntity | null> {
    return await WalletModel.findOne({ userId });
  }
  async createWallet(userId: string, amount: number): Promise<IWallet> {
    const wallet = new WalletModel({
      userId,
      amount,
    });
    return await wallet.save();
  }
  async createTransaction(data: IWalletEntity): Promise<void> {
    await WalletTransactionModel.create(data);
  }
  async getBalance(userId: string): Promise<number> {
    const user = await WalletTransactionModel.find({ userId });

    let balance = 0;

    for (const t of user) {
      if (t.type === "credit") balance += t.amount;
      if (t.type === "debit") balance -= t.amount;
    }

    return balance;
  }
  async getTransactionHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: IWalletEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      WalletTransactionModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      WalletTransactionModel.countDocuments({ userId }),
    ]);
    return { transactions, total };
  }
}
