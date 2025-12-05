import { inject, injectable } from "tsyringe";
import { IBookingsController } from "../../domain/controllerInterfaces/bookings/bookings_controller_interface";
import { Request, Response } from "express";
import { CustomError } from "../../domain/utils/custom.error";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { GetBookingDTO } from "../../application/dtos/booking_dto";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IGetBookedTurfUseCase } from "../../domain/useCaseInterfaces/Bookings/get_booked_useCase_interface";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { IRequestCancelBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/cancel_booking_usecase";
import { success } from "zod";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";

@injectable()
export class BookingsController implements IBookingsController {
  constructor(
    @inject("IGetBookingsUseCase")
    private _getBookingsUseCase: IGetBookingsUseCase,
    @inject('IGetUpcomingBookingUseCase')
    private _getUpcomingBookingsUseCase:IGetUpcomingBookingUseCase,
    @inject('IGetBookedTurfUseCase')
    private _getBookedTurfUseCase:IGetBookedTurfUseCase,
    @inject('IGetPastBookingsUseCase')
    private _getPastBookingsUseCase:IGetPastBookingsUseCase,
    @inject("IRequestCancelBookingUseCase")
    private _requestCancelBookingUseCase:IRequestCancelBookingUseCase
  ) {}
  async getAllbookings(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date } = req.query as unknown as GetBookingDTO;

      if (typeof turfId !== "string" || typeof date !== "string") {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_TURFID_OR_DATE,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const bookings = await this._getBookingsUseCase.execute(turfId, date);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        bookings,
      });
    } catch (error) {
      console.error("Error in getAllbookings", error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "failed to fetch bookings",
          bookings: [],
        });
      }
    }
  }
  async getUpcomingbookings(req: Request, res: Response): Promise<void> {
    try{
    const userId =(req as CustomRequest).user?.userId
      const { page = 1, limit = 10, search = "" } = req.query;
    console.log('boookinguserIddd',userId)

    const pageNumber = Math.max(Number(page), 1);
        const pageSize = Math.max(Number(limit), 1);
            const searchTerm = typeof search === "string" ? search : "";


    if(!userId){
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      )
    }
   const { bookings, totalPages, total } =await this._getUpcomingBookingsUseCase.execute(userId,pageNumber,pageSize,searchTerm)
console.log('bookingssss',bookings)
    res.status(HTTP_STATUS.OK).json({
      success:true,
      message:SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
      bookings,
      totalPages,
      total,
      currentPage:pageNumber
    })
  }catch(error){
    console.error("Error in upcoming bookings",error)

    if(error instanceof CustomError) {
      res.status(error.statusCode).json({
        success:false,
        message:error.message,
        bookings:[]
      })
    } else{
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:"Failed to fetch upcoming bookings",
        bookings: []
      })
    }
  }
  }

  async getPastbookings(req: Request, res: Response): Promise<void> {
    try{
      const userId =(req as CustomRequest).user?.userId

      if(!userId){
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        )
      }
        const bookings=await this._getPastBookingsUseCase.execute(userId)

        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
          bookings
        })

    }catch(error){
      if(error instanceof CustomError) {
        res.status(error.statusCode).json({
          success:false,
          message:error.message,
          bookings:[]
        })
      } else{
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success:false,
          message:"Failed to fetch past bookings",
          bookings:[]
        })
      }
    }
  }

  
  async getTurfdetails(req: Request, res: Response): Promise<void> {
    try{
      const {turfId} =req.query;

      if(typeof turfId !=="string"){
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        )
      }

      const turfDetails=await this._getBookedTurfUseCase.execute(turfId);

      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:SUCCESS_MESSAGES.TURF_DETAILS_FETCHED_SUCCESSFULLY,
        turfDetails
      })

    }catch(error){
      console.error("Error in getTurfdetails",error)
      if(error instanceof CustomError){
        res.status(error.statusCode).json({
          success:false,
          message:error.message,
          turfDetails:null
        })
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success:false,
          message:"Failed to fetch turf details",
          turfDetails:null
        })
      }
    }
  }
  async requestCancellation(req: Request, res: Response): Promise<void> {
    try{
      const userId=(req as CustomRequest).user?.userId;
      const bookingId=req.params.bookingId;
      const {reason}=req.body;
      console.log('userIdd',userId+"    ",'bookingIs',bookingId)
      if(!userId){
         res.status(401).json({
          success:false,
          message:"Unauthorized"
        })
      }
      if(!reason){
         res.status(400).json({
          success:false,
          message:"Cancellation reason is required"
        })
      }

      const result=await this._requestCancelBookingUseCase.execute(
        userId,
        bookingId,
        reason
      )
      
      res.status(200).json({
        success:true,
        message:"Cancellation request submitted successfully",
        data:result
      })
    }catch(err){
    if (err instanceof CustomError) {
         res.status(err.statusCode || 400).json({
          success: false,
          message: err.message,
        });
      }
    }
  }
}
