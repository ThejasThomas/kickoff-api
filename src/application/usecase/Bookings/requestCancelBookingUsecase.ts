import { inject, injectable } from "tsyringe";
import { IRequestCancelBookingUseCase } from "../../../domain/useCaseInterfaces/Bookings/cancel_booking_usecase";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";

@injectable()
export class RequestCancelBookingUseCase implements IRequestCancelBookingUseCase {
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository:IBookingRepository,
        @inject("ITurfRepository")
        private _turfRepositoy:ITurfRepository,
        @inject("ICancelRequestRepository")
        private _cancelrequestRepository:ICancelRequestRepository
    ){}

    async execute(userId: string, bookingId: string, reason: string): Promise<ICancellationRequestEntity> {
        const booking =await this._bookingRepository.findById(bookingId);
        if(!booking){
            throw new CustomError(
                ERROR_MESSAGES.BOOKING_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        if(booking.userId!==userId){
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                HTTP_STATUS.UNAUTHORIZED
            )
        }
        const turf=await this._turfRepositoy.getTurfById(booking.turfId)
        if(!turf){
            throw new CustomError(
                ERROR_MESSAGES.TURF_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        const ownerId=turf.ownerId;
        if(!ownerId){
            throw new CustomError(
                ERROR_MESSAGES.OWNER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        const now=new Date()
        const startTime=new Date(`${booking.date}T${booking.startTime}`);
        const minutesDiff =(startTime.getTime()-now.getTime())/60000;

        if(minutesDiff < 60){
            throw new CustomError(
                ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const exisitingrequest=await this._cancelrequestRepository.findByBookingId(bookingId)
        if(exisitingrequest){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_ALREADY_SUBMITTED,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        await this._bookingRepository.updateStatusById(bookingId,"pending_cancel")

        const request:ICancellationRequestEntity={
            bookingId,
            userId,
            ownerId,
            reason,
            status:"pending",
            createdAt:new Date()
        }
        return await this._cancelrequestRepository.createRequest(request)
    }
}
