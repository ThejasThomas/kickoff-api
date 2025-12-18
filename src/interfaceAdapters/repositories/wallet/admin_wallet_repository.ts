import { injectable } from "tsyringe";
import { IAdminWalletRepository } from "../../../domain/repositoryInterface/wallet/admin_wallet_repository_interface";
import { AdminWalletModel } from "../../database/mongoDb/schemas/admin_wallet_schema";

@injectable()
export class AdminWalletRepository implements IAdminWalletRepository {
  async getWallet() {
    let wallet = await AdminWalletModel.findOne();

    if (!wallet) {
      wallet = await AdminWalletModel.create({ balance: 0 });
    }

    return wallet;
  }

  async incrementBalance(amount: number) {
    await AdminWalletModel.findOneAndUpdate(
      {},
      { $inc: { balance: amount } },
      { upsert: true }
    );
  }
  async decrementBalance(amount: number): Promise<void> {
      await AdminWalletModel.findOneAndUpdate(
        {},
        {$inc:{balance:-amount}},
        {upsert:true}
      )
  }
}
