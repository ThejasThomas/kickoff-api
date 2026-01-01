export interface OfflineBookingRequestDTO {
  turfId: string;
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    price: number;
  }[];
  paymentStatus: "pending";
  paymentMethod?: "offline";
}
