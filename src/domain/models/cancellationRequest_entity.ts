export interface ICancellationRequestEntity {
  bookingId: string;
  userId: string;
  ownerId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
