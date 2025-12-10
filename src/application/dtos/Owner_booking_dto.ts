export interface OwnerBookingDTO {
  _id: string;
  turfId: string;
  userId: string;

  startTime: string;
  endTime: string;
  date: string;

  bookingType: "normal" | "hosted_game"|"offline"

  price: number;
  status:  "open" | "full" | "cancelled" | "completed" | "confirmed";
  paymentStatus?:"pending"|"completed"
  createdAt:string,

  hostedGameId?:string
}
