import { inject, injectable } from "tsyringe";
import { IGetPastBookingsUseCase } from "../../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { PastBookingDTO } from "../../dtos/get_booking_dto";
import { mapPastBookingList } from "../../mappers/getBookingapper";


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