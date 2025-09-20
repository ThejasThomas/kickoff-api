import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../models/booking_entity";

export interface IBookSlotUseCase{
    execute(bookData:IBookingModel,userId:string) :Promise<IBookingModel>
}