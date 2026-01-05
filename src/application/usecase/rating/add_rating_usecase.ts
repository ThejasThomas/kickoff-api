import { inject, injectable } from "tsyringe";
import { IAddRatingUseCase } from "../../../domain/useCaseInterfaces/ratings/add_rating_usecase_interface";
import { IRatingRepository } from "../../../domain/repositoryInterface/Turf/rating_repository_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IRatingDTO } from "../../dtos/rating_dto";

@injectable()
export class AddRatingUseCase implements IAddRatingUseCase {
  constructor(
    @inject("IRatingRepository")
    private _ratingRepo: IRatingRepository,
    @inject("IBookingRepository")
    private _bookingRepo: IBookingRepository
  ) {}

  async execute(data: {
    userId: string;
    turfId: string;
    bookingId: string;
    rating: number;
  }): Promise<IRatingDTO> {
    const { userId, turfId, bookingId, rating } = data;

    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (booking.status !== "completed") {
      throw new CustomError(
        ERROR_MESSAGES.REVIEW_ONLY_COMPLETED_BOOKINGS,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (booking.userId !== userId) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const existingRating = await this._ratingRepo.findByBookingId(bookingId)

    if(existingRating){
        throw new CustomError(
            ERROR_MESSAGES.REQUEST_ALREADY_SUBMITTED,
            HTTP_STATUS.CONFLICT
        )
    }
    return this._ratingRepo.create({
        userId,
        turfId,
        bookingId,
        rating,
        hasRated:true
    })
  }
}
