import { injectable } from "tsyringe";
import { IAdminWalletTransactionEntity } from "../../../domain/models/admin_wallet_transaction_entity";
import { IAdminWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/admin_wallet_transaction_history_interface";
import { AdminWalletTransactionModel } from "../../database/mongoDb/schemas/admin_wallet_transaction_schema";

@injectable()
export class AdminWalletTransactionRepository
  implements IAdminWalletTransactionRepository {

  async create(data: IAdminWalletTransactionEntity) {
    return await AdminWalletTransactionModel.create(data);
  }

  async getPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      AdminWalletTransactionModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AdminWalletTransactionModel.countDocuments(),
    ]);

    return { transactions, total };
  }
}
