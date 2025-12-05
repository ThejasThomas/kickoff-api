import { model, Types } from "mongoose";
import { IBookingEntity } from "../../../../domain/models/booking_entity";
import { BookingSchema } from "../schemas/booking_schema";

export interface IBookingModel extends Omit< IBookingEntity,"id"> {
_id:Types.ObjectId
}

export const BookinModel =model<IBookingModel>('Bookings',BookingSchema)