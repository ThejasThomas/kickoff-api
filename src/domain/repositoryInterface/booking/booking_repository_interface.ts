import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../models/booking_entity";
import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingModel> {
    findByTurfIdAndDate(turfId:string,date:string):Promise<IBookingModel[]>
    findUpComingByUserId(userId:string,skip:number,limit:number,search:string):Promise<{bookings:IBookingModel[];total:number}>;
    findPastByUserId(userId:string):Promise<IBookingModel[]>
    updateStatus(bookingId:string,status:string):Promise<ICancellationRequestEntity |null>
    getOwnerRequests(ownerId:string):Promise<ICancellationRequestEntity[]>
    updateStatusById(bookingId:string,status:string):Promise<IBookingModel|null>
}