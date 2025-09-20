import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { BookinModel, IBookingModel } from "../../database/mongoDb/models/booking_model";
import { SlotModel } from "../../database/mongoDb/models/slot_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel >{
    constructor(){
        super(BookinModel)
    }
  
}
