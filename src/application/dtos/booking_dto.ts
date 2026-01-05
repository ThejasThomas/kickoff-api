export interface GetBookingDTO{
    page:string,
    limit:string
    turfId:string,
    date:string
}
export interface IBookingDTO{
    id?:string;
    userId:string,
    turfId:string,
    startTime:string,
    endTime:string,
    price:number,
    date:string,
    status:string,
    paymentMethod:string,
    adminCommissionProcessed:boolean;
    paymentStatus:string;
    createdAt?:string;
} 