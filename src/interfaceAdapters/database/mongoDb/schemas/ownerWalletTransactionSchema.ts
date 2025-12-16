import { Schema, model } from "mongoose";
import { IOwnerWalletTransactionEntity, OwnerWalletTransactionStatus, OwnerWalletTransactionType } from "../../../../domain/models/ownerWallet_transaction_entity";


const OwnerWalletTransactionSchema =
  new Schema<IOwnerWalletTransactionEntity>(
    {
      ownerId: {
        type: String,
        required: true,
        index: true,
      },

      turfId: {
        type: Schema.Types.ObjectId,
        ref: "Turf",
        required: true,
        index: true,
      },

      bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: Object.values(OwnerWalletTransactionType),
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      reason: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        enum: Object.values(OwnerWalletTransactionStatus),
        required: true,
      },

      transactionDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

export const OwnerWalletTransactionModel =
  model<IOwnerWalletTransactionEntity>(
    "OwnerWalletTransaction",
    OwnerWalletTransactionSchema
  );
