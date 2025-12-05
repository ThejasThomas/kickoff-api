import { inject, injectable } from "tsyringe";
import { IBookSlotUseCase } from "../../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { ISlotRepository } from "../../../domain/repositoryInterface/Turf/slot_repository_interface";
import { IBookingModel } from "../../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingEntity } from "../../../domain/models/booking_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { BookingDTO } from "../../dtos/get_booking_dto";
import { mapBookingDTO } from "../../mappers/getBookingapper";


@injectable()
export class BookSlotUseCase implements IBookSlotUseCase{
    constructor(
        @inject('IBookingRepository')
        private _bookingRepository:IBookingRepository,
        @inject('ISlotRepository')
        private _slotRepository:ISlotRepository
    ){}

    async execute(bookData:IBookingEntity,userId:string): Promise<BookingDTO> {
        try{
                const normalizedDate = this.formatToISODate(bookData.date);

        const newBooking:IBookingEntity ={
            
            ...bookData,
            date: normalizedDate,
            userId
        }
        console.log('bookDaaaaataaaaaaaaaaaa',normalizedDate)
        

        const bookSlot=await this._bookingRepository.save(newBooking)

        // await this._slotRepository.updateSlotBookedStatus(
        //     bookData.turfId,
        //     bookData.date,
        //     bookData.startTime
        // )
        return mapBookingDTO(bookSlot);
    } catch(error){
        console.error('Error in book slot use case ')

        if (error instanceof CustomError) {
        throw error;
      }
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