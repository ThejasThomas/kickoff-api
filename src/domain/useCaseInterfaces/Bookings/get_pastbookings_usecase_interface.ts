import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";

export interface IGetPastBookingsUseCase {
    execute(userId:string):Promise<IBookingModel[]>
}