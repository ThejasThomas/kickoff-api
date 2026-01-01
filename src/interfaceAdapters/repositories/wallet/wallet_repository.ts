import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { IWallet } from "../../database/mongoDb/models/wallet_model";
import { WalletModel } from "../../database/mongoDb/schemas/wallet_schema";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { IWalletEntity, WalletTransactionType } from "../../../domain/models/wallet_entity";
import { WalletTransactionModel } from "../../database/mongoDb/models/wallet_transaction_model";
import { IWalletTransactionEntity, WalletTransactionStatus } from "../../../domain/models/wallet_transaction_entity";

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
  async createWallet(userId: string): Promise<IWallet> {
    const wallet = new WalletModel({
      userId,
      balance:0,
    });
    return await wallet.save();
  }
  async createTransaction(data: IWalletEntity): Promise<void> {
    await WalletTransactionModel.create(data);
  }
  async getBalance(userId: string): Promise<number> {
   const wallet=await WalletModel.findOne({userId})
   return wallet?.balance||0
  }
  async getTransactionHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: IWalletTransactionEntity[]; total: number }> {
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
  async addMoney(userId:string,amount:number,reason:string): Promise<IWalletEntity> {
    console.log('heyybrooohh')
    let wallet = await WalletModel.findOne({userId})
    console.log('wallettt',wallet)
    if(!wallet){
      wallet=await WalletModel.create({
        userId,
        balance:0
      })
    }
    wallet.balance += amount;
    await wallet.save()

    await WalletTransactionModel.create({
      userId,
      type:WalletTransactionType.CREDIT,
      amount,
      reason,
      status:WalletTransactionStatus.SUCCESS,
      transaction_date:new Date().toISOString()
    })
    console.log('userwalletcredited')

    return wallet;
  }

}
