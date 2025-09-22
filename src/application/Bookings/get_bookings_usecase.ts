import { inject, injectable } from "tsyringe";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetBookingsUseCase implements IGetBookingsUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository:IBookingRepository
    ){}

    async execute(turfId: string, date: string): Promise<IBookingModel[]> {
        try{
            if(!turfId ||!date){
                throw new CustomError(
                    ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }

            const bookings = await this._bookingRepository.findByTurfIdAndDate(turfId,date);
            return bookings;
        }catch(error){
            console.error("Error in GetBookingsUseCase:",error)
            if(error instanceof CustomError){
                throw error;
            }
            throw new CustomError(
                ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )

        }
    }
}