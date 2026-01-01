import { inject, injectable } from "tsyringe";
import { IOfflineBookingsUseCase } from "../../../domain/useCaseInterfaces/Bookings/offline_booking_usecase_interface";
import { IBookingEntity } from "../../../domain/models/booking_entity";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { BookingDTO } from "../../dtos/get_booking_dto";
import { OfflineBookingRequestDTO } from "../../dtos/offlineBookingsDTO";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { mapBookingDTO } from "../../mappers/getBookingapper";

@injectable()
export class OfflineBookingUseCase implements IOfflineBookingsUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository:IBookingRepository
    ){}

    async execute(bookData: OfflineBookingRequestDTO, userId: string): Promise<IBookingEntity[]> {
        try{
            const normalizedDate = this.formatToISODate(bookData.date);
            if (!bookData.slots || !bookData.slots.length) {
        throw new CustomError("No slots selected", HTTP_STATUS.BAD_REQUEST);
      }
            const createdBookings:BookingDTO[]=[]
            for( const slot of bookData.slots){
                const newBooking:IBookingEntity ={
                    userId,
                    turfId:bookData.turfId,
                    startTime:slot.startTime,
                    endTime:slot.endTime,
                    price:slot.price,
                    date:normalizedDate,
                    status:"confirmed",
                    paymentStatus:"pending",
                    paymentMethod: "offline",
                    adminCommissionProcessed:true
                }

                const savedBooking =await this._bookingRepository.save(newBooking)
                const mappedBooking = mapBookingDTO(savedBooking)
                createdBookings.push(mappedBooking);
            }
            return createdBookings;

        }catch(error){
            if(error instanceof CustomError) throw error;

            throw new CustomError(
                ERROR_MESSAGES.BOOKING_FAILED,
                HTTP_STATUS.BAD_REQUEST
            )
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
