import { PastBookingDTO } from "../../../application/dtos/get_booking_dto";

export interface IGetPastBookingsUseCase {
    execute(userId:string,page:number,limit:number):Promise<{bookings:PastBookingDTO[];total:number;page:number;limit:number;totalPages:number}>
}