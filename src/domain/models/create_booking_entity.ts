import { IBookingEntity } from "./booking_entity";

export type CreateBookingInput = Omit<IBookingEntity, "id" | "_id">;