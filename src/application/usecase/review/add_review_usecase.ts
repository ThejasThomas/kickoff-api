import { inject, injectable } from "tsyringe";
import { IAddReviewUseCase } from "../../../domain/useCaseInterfaces/review/add_review_usecase_interface";
import { IReviewRepository } from "../../../domain/repositoryInterface/Turf/review_repository_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IReviewDTO } from "../../dtos/review_dto";

@injectable()

export class AddReviewUseCase implements IAddReviewUseCase{
    constructor(
        @inject("IReviewRepository")
        private _reviewRepo:IReviewRepository,
        @inject("IBookingRepository")
        private _bookingRepo:IBookingRepository
    ){}

    async execute(data: { userId: string; turfId: string; bookingId: string; comment: string; }): Promise<IReviewDTO> {
        const {userId,turfId,bookingId,comment}=data;

        console.log('comment',comment)

        const booking =await this._bookingRepo.findById(bookingId);

        if(!booking){
            throw new CustomError(
                ERROR_MESSAGES.BOOKING_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(booking.status!=="completed"){
            throw new CustomError(
                ERROR_MESSAGES.REVIEW_ONLY_COMPLETED_BOOKINGS,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        if(booking.userId!==userId){
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                HTTP_STATUS.FORBIDDEN
            )
        }
        const existingReview =await this._reviewRepo.findByBookingId(bookingId)

        if(existingReview){
            throw new CustomError(
                ERROR_MESSAGES.REVIEW_ALREADY_SUBMITTED,
                HTTP_STATUS.CONFLICT
            )
        }

        return this._reviewRepo.create({
            userId,
            turfId,
            bookingId,
            comment
        })
    }
}
