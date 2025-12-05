import { number } from "zod";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { BookingDTO } from "../../../application/dtos/get_booking_dto";

export interface IGetUpcomingBookingUseCase {
    execute(userId:string,page:number,limit:number,search:string):Promise<{bookings:BookingDTO[];totalPages:number;total:number}>
}