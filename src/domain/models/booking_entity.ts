import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";

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
    adminCommissionProcessed:boolean;
    paymentStatus:string;
    createdAt?:string;
} 

export interface PaginatedBookings {
    bookings:IBookingModel[];
    total:number;
    page:number;
    limit:number;
    totalPages:number;
}

