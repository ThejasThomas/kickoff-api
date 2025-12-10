export interface BookingDTO {
     _id: string;
  userId: string;
  turfId: string;
  startTime: string;
  endTime: string;
  price: number;
  date: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt?: string;
}

export interface PastBookingDTO {
    date:string,
    startTime:string,
    endTime:string,
    price:number,
    status:string,
    paymentStatus:string
}