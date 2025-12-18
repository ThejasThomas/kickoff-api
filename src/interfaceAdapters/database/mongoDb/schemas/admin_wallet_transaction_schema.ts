import { model, Schema } from "mongoose";
import { IAdminWalletTransactionEntity } from "../../../../domain/models/admin_wallet_transaction_entity";

const AdminWalletTransactionSchema = new Schema<IAdminWalletTransactionEntity>(
  {
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    description: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const AdminWalletTransactionModel = model<IAdminWalletTransactionEntity>(
  "AdminWalletTransaction",
  AdminWalletTransactionSchema
);