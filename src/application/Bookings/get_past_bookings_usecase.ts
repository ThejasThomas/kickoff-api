import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";

@injectable()

export class GetPastBookingsUseCase implements IGetPastBookingsUseCase {
    constructor(
        @inject('IBookingRepository')
        private _bookingRepository:IBookingRepository
    ){}

    async execute(userId: string): Promise<IBookingModel[]> {
        return await this._bookingRepository.findPastByUserId(userId)
    }
}