import { OfflineBookingRequestDTO } from "../../../application/dtos/offlineBookingsDTO";
import { IBookingEntity } from "../../models/booking_entity";

export interface IOfflineBookingsUseCase{
    execute(bookData:OfflineBookingRequestDTO,userId:string):Promise<IBookingEntity[]>
}