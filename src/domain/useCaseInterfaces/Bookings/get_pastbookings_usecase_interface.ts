import { PastBookingDTO } from "../../../application/dtos/get_booking_dto";

export interface IGetPastBookingsUseCase {
    execute(userId:string):Promise<PastBookingDTO[]>
}