import { IBookingEntity } from "../../models/booking_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
    
}