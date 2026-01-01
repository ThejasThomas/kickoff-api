import { inject, injectable } from "tsyringe";
import { IGetPastBookingsUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { PastBookingDTO } from "../../dtos/get_booking_dto";
import {
  mapPastBookingDTO,
  mapPastBookingList,
} from "../../mappers/getBookingapper";
import { IReviewRepository } from "../../../domain/repositoryInterface/Turf/review_repository_interface";
import { IRatingRepository } from "../../../domain/repositoryInterface/Turf/rating_repository_interface";

@injectable()
export class GetPastBookingsUseCase implements IGetPastBookingsUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,
    @inject("IRatingRepository")
    private _ratingRepository: IRatingRepository
  ) {}

  async execute(userId: string): Promise<PastBookingDTO[]> {
    const bookings = await this._bookingRepository.findPastByUserId(userId);

    const bookingIds = bookings.map((b) => b._id.toString());

    const reviewsBookingIds = await this._reviewRepository.findByBookingIds(
      bookingIds
    );
    const ratedBookingIds = await this._ratingRepository.findByBookingIds(
      bookingIds
    );

    const reviewedSet = new Set(reviewsBookingIds);
    const ratedSet = new Set(ratedBookingIds);

    return bookings.map((b) => ({
      ...mapPastBookingDTO(b),
      hasReviewed: reviewedSet.has(b._id.toString()),
      hasRated: ratedSet.has(b._id.toString()),
    }));
  }
}
