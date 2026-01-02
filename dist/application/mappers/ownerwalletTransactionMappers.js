"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOwnerWalletTransaction = void 0;
const mapOwnerWalletTransaction = (tx) => ({
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
exports.mapOwnerWalletTransaction = mapOwnerWalletTransaction;
