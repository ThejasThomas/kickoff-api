import { inject, injectable } from "tsyringe";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";

@injectable()

export class GetUpcomingBookingsUseCase implements IGetUpcomingBookingUseCase {
constructor(
    @inject('IBookingRepository')
    private _bookingRepository:IBookingRepository
    ){}

    async execute(userId: string): Promise<IBookingModel[]> {
        console.log('heyyy iD',userId)
        return await this._bookingRepository.findUpComingByUserId(userId)
    }
    
}