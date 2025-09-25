import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ISlotModel, SlotModel } from "../../database/mongoDb/models/slot_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ISlotRepository } from "../../../domain/repositoryInterface/Turf/slot_repository_interface";

@injectable()

export class SlotRepository extends BaseRepository<ISlotModel> implements ISlotRepository{
    constructor(){
        super(SlotModel)
    }
      async updateSlotBookedStatus(
    turfId: string,
    date: string,
    startTime: string
  ): Promise<void> {
    try {
      const result = await SlotModel.updateOne(
        { turfId, date, startTime, isBooked: false },
        { $set: { isBooked: true } }
      );

      if (result.matchedCount === 0) {
        throw new CustomError(
          ERROR_MESSAGES.SLOT_NOT_FOUND_OR_ALREADY_BOOKED,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    } catch (error) {
      console.error("Error updating slot booked status:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.SLOT_UPDATE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}