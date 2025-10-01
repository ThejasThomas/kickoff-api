import { inject, injectable } from "tsyringe";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { IBookingEntity } from "../../domain/models/booking_entity";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISlotRepository } from "../../domain/repositoryInterface/Turf/slot_repository_interface";

@injectable()
export class BookSlotUseCase implements IBookSlotUseCase{
    constructor(
        @inject('IBookingRepository')
        private _bookingRepository:IBookingRepository,
        @inject('ISlotRepository')
        private _slotRepository:ISlotRepository
    ){}

    async execute(bookData:IBookingEntity,userId:string): Promise<IBookingModel> {
        try{
        const newBooking:IBookingEntity ={
            ...bookData,
            userId
        }
        

        const bookSlot=await this._bookingRepository.save(newBooking)

        // await this._slotRepository.updateSlotBookedStatus(
        //     bookData.turfId,
        //     bookData.date,
        //     bookData.startTime
        // )
        return bookSlot;
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
}