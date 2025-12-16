import { Types } from "mongoose";
import { OwnerWalletTransactionType } from "../../domain/models/ownerWallet_transaction_entity";

export interface OwnerWalletTransactionDTO {
  _id: Types.ObjectId;
  type: OwnerWalletTransactionType;
  amount: number;
  transactionDate: Date;

  turfId?: {
    _id: Types.ObjectId;
    turfName: string;
  };

  bookingId?: {
    _id: Types.ObjectId;
    userId?: {
      _id: Types.ObjectId;
      fullName: string;
    };
  };
}
