import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { mapPastBookingList } from "../../presentation/mappers/getBookingapper";
import { PastBookingDTO } from "../../presentation/dtos/get_booking_dto";

@injectable()

export class GetPastBookingsUseCase implements IGetPastBookingsUseCase {
    constructor(
        @inject('IBookingRepository')
        private _bookingRepository:IBookingRepository
    ){}

    async execute(userId: string): Promise<PastBookingDTO[]> {
        const bookings= await this._bookingRepository.findPastByUserId(userId)
        return mapPastBookingList(bookings)
    }
}