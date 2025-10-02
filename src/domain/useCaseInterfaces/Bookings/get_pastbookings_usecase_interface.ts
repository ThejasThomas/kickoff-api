import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { PastBookingDTO } from "../../../presentation/dtos/get_booking_dto";

export interface IGetPastBookingsUseCase {
    execute(userId:string):Promise<PastBookingDTO[]>
}