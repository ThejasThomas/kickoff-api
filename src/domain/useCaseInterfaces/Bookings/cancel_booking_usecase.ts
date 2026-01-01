import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";

export interface IRequestCancelBookingUseCase{
    execute(userId:string,bookingId:string,reason:string):Promise<ICancellationRequestEntity>

    }
