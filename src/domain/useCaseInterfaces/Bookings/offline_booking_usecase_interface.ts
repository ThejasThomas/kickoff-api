import { IBookingDTO } from "../../../application/dtos/booking_dto";
import { OfflineBookingRequestDTO } from "../../../application/dtos/offlineBookingsDTO";

export interface IOfflineBookingsUseCase{
    execute(bookData:OfflineBookingRequestDTO,userId:string):Promise<IBookingDTO[]>
}