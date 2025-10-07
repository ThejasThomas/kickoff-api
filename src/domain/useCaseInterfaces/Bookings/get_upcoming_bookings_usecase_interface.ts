import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";

export interface IGetUpcomingBookingUseCase {
    execute(userId:string):Promise<IBookingModel[]>
}