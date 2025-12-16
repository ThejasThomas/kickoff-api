import { Types } from "mongoose";
import { IOwnerWalletTransactionEntity } from "../../../domain/models/ownerWallet_transaction_entity";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { OwnerWalletTransactionModel } from "../../database/mongoDb/schemas/ownerWalletTransactionSchema";
import { injectable } from "tsyringe";
import path from "path";
import { OwnerWalletTransactionDTO } from "../../../application/dtos/ownerwalletTransaction_dto";


@injectable()
export class OwnerWalletTransactionRepository implements IOwnerWalletTransactionRepository{
   async create(
    data: IOwnerWalletTransactionEntity
  ): Promise<IOwnerWalletTransactionEntity> {
    const transaction = await OwnerWalletTransactionModel.create(data);
    return transaction.toObject();
  }

 async findByOwnerId(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: any[]; total: number }> {

    const skip = (page - 1) * limit;

    const [transactions, totalResult] = await Promise.all([

   OwnerWalletTransactionModel.aggregate([
  { $match: { ownerId } },

  // 🟢 Join Booking
  {
    $lookup: {
      from: "bookings",
      localField: "bookingId",
      foreignField: "_id",
      as: "booking"
    }
  },
  {
    $unwind: {
      path: "$booking",
      preserveNullAndEmptyArrays: true
    }
  },

  // 🟢 Join Client only if booking exists
  {
    $lookup: {
      from: "clients",
      let: { userId: "$booking.userId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$userId", "$$userId"] }
          }
        },
        {
          $project: { fullName: 1, email: 1 }
        }
      ],
      as: "client"
    }
  },
  {
    $unwind: {
      path: "$client",
      preserveNullAndEmptyArrays: true
    }
  },

  // 🟢 Join Turf
  {
    $lookup: {
      from: "turfs",
      localField: "turfId",
      foreignField: "_id",
      as: "turf"
    }
  },
  {
    $unwind: {
      path: "$turf",
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $project: {
      _id: 1,
      type: 1,
      amount: 1,
      transactionDate: 1,

      turf: {
        _id: "$turf._id",
        turfName: "$turf.turfName"
      },

      booking: {
        _id: "$booking._id",
        user: {
          fullName: "$client.fullName",
          email: "$client.email"
        }
      }
    }
  }
])



,

      OwnerWalletTransactionModel.countDocuments({ ownerId })
    ]);

    return {
      transactions,
      total: totalResult
    };
  }

  async findByOwnerAndTurf(
    ownerId: string,
    turfId: string
  ): Promise<IOwnerWalletTransactionEntity[]> {
    return await OwnerWalletTransactionModel.find({
      ownerId,
      turfId: new Types.ObjectId(turfId),
    })
      .sort({ createdAt: -1 })
      .lean();
  }

}