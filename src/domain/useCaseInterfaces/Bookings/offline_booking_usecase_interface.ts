import { OfflineBookingRequestDTO } from "../../../application/dtos/offlineBookingsDTO";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../models/booking_entity";

export interface IOfflineBookingsUseCase{
    execute(bookData:OfflineBookingRequestDTO,userId:string):Promise<IBookingEntity[]>
}