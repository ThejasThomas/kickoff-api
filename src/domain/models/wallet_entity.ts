export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}
export enum WalletTransactionStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
}
export interface IWalletEntity{
    id?:string,
    userId:string,
    balance:number
}