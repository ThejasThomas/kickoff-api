import { inject, injectable } from "tsyringe";
import { IGetCancelRequestsUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_cancel_booking_requests_interface";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";

@injectable()

export class GetCancelBookingRequestsUsecase implements IGetCancelRequestsUseCase{
    constructor(
         @inject("ICancelRequestRepository")
        private _cancelRequestRepo:ICancelRequestRepository
    ){}   
    async execute(ownerId: string,page:number,limit:number): Promise<{requests:ICancellationRequestEntity[],total:number,page:number,limit:number,totalPages:number}> {
        const currentPage=Math.max(page,1)
        const currentLimit=Math.max(limit,1)

        const {requests,total}=await this._cancelRequestRepo.getCancelRequestByOwnerId(
            ownerId,
            currentPage,
            currentLimit
        )
        console.log("yayyyyyy",requests,total)

        return {
            requests,
            total,
            page:currentPage,
            limit:currentLimit,
            totalPages:Math.ceil(total/currentLimit)
        }
    }
}
