import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { BookinModel, IBookingModel } from "../../database/mongoDb/models/booking_model";
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

    async findUpComingByUserId(userId: string): Promise<IBookingModel[]> {
        try{
            const now =new Date();
            const currentDateStr = now.toISOString().split('T')[0];
            const currentTimeStr =`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
            const bookings = await BookinModel.find({
                userId,
                $or: [
                    { date: { $gt: currentDateStr } },
                    { date: currentDateStr, endTime: { $gt: currentTimeStr } },
                ],
            }).exec();
            return bookings;
        }catch(error){
            console.error("Error fetching upcoming bookings by userId:",error)
            throw new CustomError(
                ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }
    }
    async findPastByUserId(userId: string): Promise<IBookingModel[]> {
        try{
            const now =new Date();
            const currentDateStr = now.toISOString().split('T')[0];

            const bookings =await BookinModel.find({
                userId,
                $or:[
                    {date:{$lt:currentDateStr}},
                    {date:currentDateStr,endTime:{$lt:currentDateStr}},
                ]
            }).exec()
            return bookings;
        }catch(error){
            throw new CustomError(
                ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )

        }
    }

    

  
}
