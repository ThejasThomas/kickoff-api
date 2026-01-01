export interface IAdminWalletTransactionEntity {
  type: "CREDIT" | "DEBIT";
  amount: number;
  ownerId?: string;
  bookingId?: string;
  transactionDate: Date;
  description: string;
}
