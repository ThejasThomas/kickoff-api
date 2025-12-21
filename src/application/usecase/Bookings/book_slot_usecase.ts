import { inject, injectable } from "tsyringe";
import { IBookSlotUseCase } from "../../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingEntity } from "../../../domain/models/booking_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { BookingDTO } from "../../dtos/get_booking_dto";
import { mapBookingDTO } from "../../mappers/getBookingapper";
import { IRedisTokenRepository } from "../../../domain/repositoryInterface/redis/redis_token_repository_interface";

@injectable()
export class BookSlotUseCase implements IBookSlotUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IRedisTokenRepository")
    private _redisRepository: IRedisTokenRepository
  ) {}

  async execute(bookData: IBookingEntity, userId: string): Promise<BookingDTO> {
    try {
      console.log("dataas", bookData, userId);
      const normalizedDate = this.formatToISODate(bookData.date);

      const isLockValid = await this._redisRepository.verifyLock(
        bookData.turfId,
        normalizedDate,
        bookData.startTime,
        bookData.endTime,
        userId
      );

      if (!isLockValid) {
        throw new CustomError(
          ERROR_MESSAGES.SLOT_LOCK_EXPIRE_OR_INVALID,
          HTTP_STATUS.CONFLICT
        );
      }

      const alreadyBooked = await this._bookingRepository.findSlotBooking(
        bookData.turfId,
        normalizedDate,
        bookData.startTime,
        bookData.endTime
      );

      if (alreadyBooked) {
        throw new CustomError(
          ERROR_MESSAGES.SLOT_ALREADY_BOOKED,
          HTTP_STATUS.CONFLICT
        );
      }

      const newBooking: IBookingEntity = {
        ...bookData,
        date: normalizedDate,
        userId,
      };
      console.log("bookDaaaaataaaaaaaaaaaa", normalizedDate);

      const bookSlot = await this._bookingRepository.save(newBooking);

      await this._redisRepository.releaseLock(
        bookData.turfId,
        normalizedDate,
        bookData.startTime,
        bookData.endTime,
        userId
      );

      // await this._slotRepository.updateSlotBookedStatus(
      //     bookData.turfId,
      //     bookData.date,
      //     bookData.startTime
      // )
      return mapBookingDTO(bookSlot);
    } catch (error) {
      console.error("Error in book slot use case ");

      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
  private formatToISODate(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
