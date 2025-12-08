import { inject, injectable } from "tsyringe";
import { IGetBookingsUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { mapBookingDTOList } from "../../mappers/getBookingapper";
import { BookingDTO } from "../../dtos/get_booking_dto";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { OwnerBookingDTO } from "../../dtos/Owner_booking_dto";

@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IHostedGameRepository")
    private _hostedGameRepository: IHostedGameRepository
  ) {}

  async execute(turfId: string, date: string): Promise<OwnerBookingDTO[]> {
    try {
      if (!turfId || !date) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const bookings = await this._bookingRepository.findByTurfIdAndDate(
        turfId,
        date
      );
      const mappedBookings: OwnerBookingDTO[] = mapBookingDTOList(bookings).map(
        (book) => ({
          _id: book._id!,
          turfId: book.turfId,
          userId: book.userId,

          startTime: book.startTime,
          endTime: book.endTime,
          date: book.date,
          bookingType: "normal",
          price: book.price,
          status: book.status as OwnerBookingDTO["status"],
          createdAt:book.createdAt? new Date(book.createdAt).toISOString():new Date().toISOString(),
        })
      );

      const hostedGames =
        await this._hostedGameRepository.findByTurfAndDateForOwner(
          turfId,
          date
        );

      const mappedHostedGames: OwnerBookingDTO[] = hostedGames.map((game) => ({
       _id: game._id!.toString(),
       hostedGameId:game._id!.toString(),
        turfId: game.turfId,
        userId: game.hostUserId,
        startTime: game.startTime,
        endTime: game.endTime,
        date: game.slotDate,
        bookingType: "hosted_game",
        price: game.pricePerPlayer * (game.players?.length || 1),
        status: game.status as OwnerBookingDTO["status"],
        createdAt: new Date(game.createdAt??Date.now()).toISOString(),
      }));

      return [...mappedBookings, ...mappedHostedGames];
    } catch (error) {
      console.error("Error in GetBookingsUseCase:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
