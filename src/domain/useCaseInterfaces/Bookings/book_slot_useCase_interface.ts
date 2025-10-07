import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";

export interface IBookSlotUseCase{
    execute(bookData:IBookingModel,userId:string) :Promise<IBookingModel>
}