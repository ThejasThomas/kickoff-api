export interface OwnerBookingDTO {
  _id: string;
  turfId: string;
  userId: string;

  startTime: string;
  endTime: string;
  date: string;

  bookingType: "normal" | "hosted_game";

  price: number;
  status:  "open" | "full" | "cancelled" | "completed" | "confirmed";
  createdAt:string,

  hostedGameId?:string
}
