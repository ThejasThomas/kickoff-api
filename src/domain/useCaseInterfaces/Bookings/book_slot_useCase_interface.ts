import { BookingDTO } from "../../../application/dtos/get_booking_dto";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../models/booking_entity";

export type CreateBookingInput = Omit<IBookingEntity, '_id' | 'userId'>;

export interface IBookSlotUseCase{
    execute(bookData:CreateBookingInput,userId:string) :Promise<BookingDTO>
}