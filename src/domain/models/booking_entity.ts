
export interface IBookingEntity{
    id?:string;
    userId:string,
    turfId:string,
    startTime:string,
    endTime:string,
    price:number,
    date:string,
    status:string,
    paymentMethod:string,
    paymentStatus:string;
    createdAt:string;
} 

