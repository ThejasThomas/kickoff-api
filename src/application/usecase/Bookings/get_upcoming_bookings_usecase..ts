import { inject, injectable } from "tsyringe";
import { IGetUpcomingBookingUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { mapBookingDTOList } from "../../mappers/getBookingapper";

@injectable()
export class GetUpcomingBookingsUseCase implements IGetUpcomingBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ bookings: IBookingModel[]; totalPages: number; total: number }> {
    const skip = (page - 1) * limit;

    console.log("heyyy iD", userId);
    const { bookings, total } =
      await this._bookingRepository.findUpComingByUserId(
        userId,
        skip,
        limit,
        search
      );
    const mappedBookings = mapBookingDTOList(bookings);

    return {
      bookings: mappedBookings,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }
}
