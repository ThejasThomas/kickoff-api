import { inject, injectable } from "tsyringe";
import { IBookingsController } from "../../domain/controllerInterfaces/bookings/bookings_controller_interface";
import { Request, Response } from "express";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { success } from "zod";

@injectable()
export class BookingsController implements IBookingsController {
    constructor(
        @inject('IGetBookingsUseCase')
        private _getBookingsUseCase:IGetBookingsUseCase

    ){}
    async getAllbookings(req: Request, res: Response): Promise<void> {
        try{
        const {turfId,date} =req.query;
        console.log('helooooooiiiiii',turfId,date)

        if(typeof turfId !=="string" || typeof date !=="string"){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TURFID_OR_DATE,
                HTTP_STATUS.BAD_REQUEST
            );
        }
        console.log("Fetching bookings for ",{turfId,date});

        const bookings = await this._getBookingsUseCase.execute(turfId,date);
        console.log('bookings',bookings)

        res.status(HTTP_STATUS.OK).json({
            success:true,
            message:SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
            bookings
        })
    }catch(error){
        console.error("Error in getAllbookings",error);
        if(error instanceof CustomError) {
            res.status(error.statusCode).json({
                success:false,
                message:error.message,
                bookings:[]
            })
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"failed to fetch bookings",
                bookings:[],
            })
        }
    }
        
    }
}