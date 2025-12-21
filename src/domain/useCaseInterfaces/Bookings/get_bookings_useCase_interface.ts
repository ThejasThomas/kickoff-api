import { OwnerBookingDTO } from "../../../application/dtos/Owner_booking_dto";

export interface IGetBookingsUseCase {
    execute(turfId:string,date:string):Promise<OwnerBookingDTO[]>
}
