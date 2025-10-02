import { inject, injectable } from "tsyringe";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IBookingModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { mapBookingDTOList } from "../../presentation/mappers/getBookingapper";

@injectable()

export class GetUpcomingBookingsUseCase implements IGetUpcomingBookingUseCase {
constructor(
    @inject('IBookingRepository')
    private _bookingRepository:IBookingRepository
    ){}

    async execute(userId: string): Promise<IBookingModel[]> {
        console.log('heyyy iD',userId)
        const bookings= await this._bookingRepository.findUpComingByUserId(userId)
        return mapBookingDTOList(bookings)
    }
    
}