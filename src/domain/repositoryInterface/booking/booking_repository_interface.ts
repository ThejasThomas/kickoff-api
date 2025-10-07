import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../models/booking_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
    findByTurfIdAndDate(turfId:string,date:string):Promise<IBookingModel[]>
    findUpComingByUserId(userId:string):Promise<IBookingModel[]>;
    findPastByUserId(userId:string):Promise<IBookingModel[]>
}