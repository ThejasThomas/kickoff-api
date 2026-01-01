export interface IGetOwnerWalletTransactionEntity {
  _id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  transactionDate: Date | string;

  turf: {
    _id: string;
    turfName: string;
  } | null;

  booking: {
    _id: string;
    user: {
      fullName: string;
      email: string;
    } | null;
  } | null;
}
