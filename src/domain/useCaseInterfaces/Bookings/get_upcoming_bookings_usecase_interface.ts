import { number } from "zod";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";

export interface IGetUpcomingBookingUseCase {
    execute(userId:string,page:number,limit:number,search:string):Promise<{bookings:IBookingModel[];totalPages:number;total:number}>
}