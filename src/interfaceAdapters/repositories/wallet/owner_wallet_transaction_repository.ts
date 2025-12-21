import { Types } from "mongoose";
import { IOwnerWalletTransactionEntity } from "../../../domain/models/ownerWallet_transaction_entity";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { OwnerWalletTransactionModel } from "../../database/mongoDb/schemas/ownerWalletTransactionSchema";
import { injectable } from "tsyringe";
import { AdminTransactionDetailsEntity } from "../../../domain/models/admin_transaction_details_entity";
import { BookinModel } from "../../database/mongoDb/models/booking_model";
import { TurfModel } from "../../database/mongoDb/models/turf_model";
import { ClientModel } from "../../database/mongoDb/models/client_model";

@injectable()
export class OwnerWalletTransactionRepository
  implements IOwnerWalletTransactionRepository
{
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

        {
          $lookup: {
            from: "bookings",
            localField: "bookingId",
            foreignField: "_id",
            as: "booking",
          },
        },
        {
          $unwind: {
            path: "$booking",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "clients",
            let: { userId: "$booking.userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId"] },
                },
              },
              {
                $project: { fullName: 1, email: 1 },
              },
            ],
            as: "client",
          },
        },
        {
          $unwind: {
            path: "$client",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "turfs",
            localField: "turfId",
            foreignField: "_id",
            as: "turf",
          },
        },
        {
          $unwind: {
            path: "$turf",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            type: 1,
            amount: 1,
            transactionDate: 1,

            turf: {
              _id: "$turf._id",
              turfName: "$turf.turfName",
            },

            booking: {
              _id: "$booking._id",
              user: {
                fullName: "$client.fullName",
                email: "$client.email",
              },
            },
          },
        },
      ]),

      OwnerWalletTransactionModel.countDocuments({ ownerId }),
    ]);

    return {
      transactions,
      total: totalResult,
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

  async getPaginated(
    page: number,
    limit: number
  ): Promise<{ transactions: IOwnerWalletTransactionEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      OwnerWalletTransactionModel.find()
        .populate("turfId", "turfName")
        .populate("bookingId", "_id")
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerWalletTransactionModel.countDocuments(),
    ]);
    return { transactions, total };
  }
  async getByTransactionId(transactionId: string): Promise<AdminTransactionDetailsEntity | null> {
    const transaction = await OwnerWalletTransactionModel.findById(
      new Types.ObjectId(transactionId)
    ).lean()

    if(!transaction){
      return null;
    }

    const booking=await BookinModel.findById(transaction.bookingId).lean()
    if(!booking) return null

    const turf=await TurfModel.findById(transaction.turfId).lean()

    if(!turf) return null;

    const user =await ClientModel.findOne({
      userId:booking.userId
    }).lean()

    return {
      transaction:{
      id:transaction._id.toString(),
      type:transaction.type,
      amount:transaction.amount,
      reason:transaction.reason,
      status:transaction.status,
      transactionDate:transaction.transactionDate
      },
      turf: {
        id: turf._id.toString(),
        turfName: turf.turfName,
        city: turf.location?.city,
        state: turf.location?.state,
        ownerId: turf.ownerId,
      },
       booking: {
        id: booking._id.toString(),
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        price: booking.price,
      },
      user: {
        id: user?._id.toString() || "",
        fullName: user?.fullName || "Unknown",
        email: user?.email || "",
      },
    }
    
  }
}
