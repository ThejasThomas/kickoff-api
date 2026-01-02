"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionStatus = exports.WalletTransactionType = void 0;
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["CREDIT"] = "credit";
    WalletTransactionType["DEBIT"] = "debit";
})(WalletTransactionType || (exports.WalletTransactionType = WalletTransactionType = {}));
var WalletTransactionStatus;
(function (WalletTransactionStatus) {
    WalletTransactionStatus["SUCCESS"] = "success";
    WalletTransactionStatus["FAILED"] = "failed";
    WalletTransactionStatus["PENDING"] = "pending";
})(WalletTransactionStatus || (exports.WalletTransactionStatus = WalletTransactionStatus = {}));
