import { model, Schema } from "mongoose";
import {
  IWalletTransactionEntity,
  WalletTransactionStatus,
} from "../../../../domain/models/wallet_transaction_entity";
import {
  IWalletEntity,
  WalletTransactionType,
} from "../../../../domain/models/wallet_entity";
import { WalletSchema } from "./wallet_schema";

export const WalletTransactionSchema = new Schema<IWalletTransactionEntity>(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(WalletTransactionType),
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
      required: true,
      enum: Object.values(WalletTransactionStatus),
    },
    transaction_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const WalletModel = model<IWalletEntity>("Wallet", WalletSchema);
