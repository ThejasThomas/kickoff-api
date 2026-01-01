import { inject, injectable } from "tsyringe";
import { ICheckSlotIsBookedUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/checkslotIsBookedUseCase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { IBlockedSlotRepository } from "../../../domain/repositoryInterface/Turf/blocked_slot_repository_interface";
import { ISlotAvailabilityResultEntity } from "../../dtos/slot_availability_result_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class CheckSlotIsBooked implements ICheckSlotIsBookedUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IHostedGameRepository")
    private _hostedGameRepository: IHostedGameRepository,
    @inject("IBlockedSlotRepository")
    private _blockedSlotRepository: IBlockedSlotRepository
  ) {}

  async execute(
    turfId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ISlotAvailabilityResultEntity> {
    if (!turfId || !date || !startTime || !endTime) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const blockedList = await this._blockedSlotRepository.findByTurfAndDate(
      turfId,
      date,
      startTime,
      endTime
    );
    const blocked = blockedList?.[0];

    if (blocked) {
      return {
        status: "BLOCKED",
        blockedSlot: blocked,
      };
    }

    const booking = await this._bookingRepository.findSlotBooking(
      turfId,
      date,
      startTime,
      endTime
    );

    if (booking) {
      return {
        status: "NORMAL_BOOKED",
        booking,
      };
    }

    const hostGame = await this._hostedGameRepository.findBySlot(
      turfId,
      date,
      startTime,
      endTime
    );
    if (hostGame) {
      return {
        status: "HOSTED_GAME",
        hostedGame:hostGame,
      };
    }
    return {
        status:"AVAILABLE"
    }
  }
}

