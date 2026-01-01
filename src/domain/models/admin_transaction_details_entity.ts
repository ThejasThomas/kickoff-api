export interface AdminTransactionDetailsEntity {
  transaction: {
    id: string;
    type: string;
    amount: number;
    reason: string;
    status: string;
    transactionDate: Date;
  };

  turf: {
    id: string;
    turfName: string;
    city?: string;
    state?: string;
    ownerId: string;
  };

  booking: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
  };

  user: {
    id: string;
    fullName: string;
    email: string;
  };
}
