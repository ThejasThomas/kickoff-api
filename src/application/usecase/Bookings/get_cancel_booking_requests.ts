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
    async execute(ownerId: string): Promise<ICancellationRequestEntity[]> {
        console.log('oenerrrrrBroooo',ownerId)
        return await this._cancelRequestRepo.getCancelRequestByOwnerId(ownerId)
    }
}