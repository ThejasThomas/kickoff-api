import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ICancelRequestRepository extends IBaseRepository<ICancellationRequestEntity>{
    findByBookingId(bookingId:string):Promise<ICancellationRequestEntity|null>
    createRequest(data:ICancellationRequestEntity):Promise<ICancellationRequestEntity>
    getCancelRequestByOwnerId(ownerId:string):Promise<ICancellationRequestEntity[]>
}