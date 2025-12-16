import { IOwnerWalletEntity } from "../../../domain/models/ownerWalletEntity";
import { IOwnerWalletRepository } from "../../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { OwnerWalletModel } from "../../database/mongoDb/schemas/owner_wallet_schema";

export class OwnerWalletRepository implements IOwnerWalletRepository {

  async findByOwnerId(ownerId: string): Promise<IOwnerWalletEntity | null> {
    return await OwnerWalletModel.findOne({ ownerId }).lean();
  }

  async create(ownerId: string): Promise<IOwnerWalletEntity> {
    const wallet = await OwnerWalletModel.create({
      ownerId,
      balance: 0,
    });

    return wallet.toObject();
  }

  async incrementBalance(ownerId: string, amount: number): Promise<void> {
    await OwnerWalletModel.updateOne(
      { ownerId },
      { $inc: { balance: amount } }
    );
  }

  async decrementBalance(ownerId: string, amount: number): Promise<void> {
    await OwnerWalletModel.updateOne(
      { ownerId },
      { $inc: { balance: -amount } }
    );
  }
  
}
