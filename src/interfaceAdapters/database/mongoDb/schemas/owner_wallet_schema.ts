import { Schema, model } from "mongoose";
import { IOwnerWalletEntity } from "../../../../domain/models/ownerWalletEntity";

const OwnerWalletSchema = new Schema<IOwnerWalletEntity>(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const OwnerWalletModel = model<IOwnerWalletEntity>(
  "OwnerWallet",
  OwnerWalletSchema
);
