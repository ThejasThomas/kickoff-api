import { IGetOwnerWalletTransactionEntity } from "../../domain/models/getownerWalletTransaction_entity";

export const mapOwnerWalletTransaction = (
  tx: any
): IGetOwnerWalletTransactionEntity => ({
  _id: tx._id.toString(),
  type: tx.type,
  amount: tx.amount,
  transactionDate: tx.transactionDate,

  turf: tx.turf && tx.turf._id
    ? {
        _id: tx.turf._id.toString(),
        turfName: tx.turf.turfName
      }
    : null,

  booking: tx.booking && tx.booking._id
    ? {
        _id: tx.booking._id.toString(),
        user: tx.booking.user
          ? {
              fullName: tx.booking.user.fullName,
              email: tx.booking.user.email
            }
          : null
      }
    : null
});
