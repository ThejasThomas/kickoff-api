import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { BookinModel, IBookingModel } from "../../database/mongoDb/models/booking_model";
import { SlotModel } from "../../database/mongoDb/models/slot_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel > implements IBookingRepository{
    constructor(){
        super(BookinModel)
    }
    async findByTurfIdAndDate(turfId: string, date: string): Promise<IBookingModel[]> {
        try{
            const bookings= await BookinModel.find({turfId,date}).exec()
            return bookings;
        }catch(error){
            console.error("Error fetching boookings by turfId and  date:",error);
            throw new CustomError(
                ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }
    }

  
}
