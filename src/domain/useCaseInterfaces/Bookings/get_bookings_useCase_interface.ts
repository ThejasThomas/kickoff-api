import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";

export interface IGetBookingsUseCase {
    execute(turfId:string,date:string):Promise<IBookingModel[]>
}