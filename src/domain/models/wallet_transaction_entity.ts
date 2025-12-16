export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}
export enum WalletTransactionStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
}
export interface IWalletTransactionEntity {
    userId:string,
    ownerId:string,
    turfId:string,
    type:WalletTransactionType,
    amount:number,
    reason:string,
    status:WalletTransactionStatus,
    transaction_date:string
}