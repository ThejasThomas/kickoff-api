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
import { string, success } from "zod";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";
import { IHandlOwnerCancelRequestUseCase } from "../../domain/useCaseInterfaces/Bookings/handle_owner_cancel_request_usecase_interface";
import { IGetCancelRequestsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_cancel_booking_requests_interface";
import { ICreateHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/create_hosted_game_usecase_interface";
import { IGetUpcomingHostedGamesUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_hostedGame_useCase";
import { IJoinHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/join_hostedGame_usecase_interface";
import { IGetSingleHostedGameUseCase } from "../../domain/useCaseInterfaces/Bookings/getSingleHostedGameUseCase_interface";
import moment from "moment-timezone";
import { IHoldSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/hold_slot_usecase_interface";

@injectable()
export class BookingsController implements IBookingsController {
  constructor(
    @inject("IGetBookingsUseCase")
    private _getBookingsUseCase: IGetBookingsUseCase,
    @inject("IGetUpcomingBookingUseCase")
    private _getUpcomingBookingsUseCase: IGetUpcomingBookingUseCase,
    @inject("IGetBookedTurfUseCase")
    private _getBookedTurfUseCase: IGetBookedTurfUseCase,
    @inject("IGetPastBookingsUseCase")
    private _getPastBookingsUseCase: IGetPastBookingsUseCase,
    @inject("IRequestCancelBookingUseCase")
    private _requestCancelBookingUseCase: IRequestCancelBookingUseCase,
    @inject("IHandlOwnerCancelRequestUseCase")
    private _handleOwnerCancelUseCase: IHandlOwnerCancelRequestUseCase,
    @inject("IGetCancelRequestsUseCase")
    private _getCancellBookingsUseCase: IGetCancelRequestsUseCase,
    @inject("ICreateHostedGameUseCase")
    private _createHostedGameUseCase: ICreateHostedGameUseCase,
    @inject("IGetUpcomingHostedGamesUseCase")
    private _getUpcomingHostedGamesUseCase: IGetUpcomingHostedGamesUseCase,
    @inject("IJoinHostedGameUseCase")
    private _joinHostedGameUsecase: IJoinHostedGameUseCase,
    @inject("IGetSingleHostedGameUseCase")
    private _getSingleHostedGameUseCase: IGetSingleHostedGameUseCase,
    @inject("IHoldSlotUseCase")
    private _holdSlotUseCase: IHoldSlotUseCase
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
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { page = 1, limit = 10, search = "" } = req.query;
      console.log("boookinguserIddd", userId);

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";

      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      const { bookings, totalPages, total } =
        await this._getUpcomingBookingsUseCase.execute(
          userId,
          pageNumber,
          pageSize,
          searchTerm
        );
      console.log("bookingssss", bookings);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        bookings,
        totalPages,
        total,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.error("Error in upcoming bookings", error);

      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch upcoming bookings",
          bookings: [],
        });
      }
    }
  }

  async getPastbookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;

      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      const bookings = await this._getPastBookingsUseCase.execute(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
        bookings,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          bookings: [],
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch past bookings",
          bookings: [],
        });
      }
    }
  }

  async getTurfdetails(req: Request, res: Response): Promise<void> {
    try {
      const { turfId } = req.query;

      if (typeof turfId !== "string") {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const turfDetails = await this._getBookedTurfUseCase.execute(turfId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TURF_DETAILS_FETCHED_SUCCESSFULLY,
        turfDetails,
      });
    } catch (error) {
      console.error("Error in getTurfdetails", error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          turfDetails: null,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to fetch turf details",
          turfDetails: null,
        });
      }
    }
  }
  async requestCancellation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const bookingId = req.params.bookingId;
      const { reason } = req.body;
      console.log("userIdd", userId + "    ", "bookingIs", bookingId);
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      if (!reason) {
        res.status(400).json({
          success: false,
          message: "Cancellation reason is required",
        });
      }

      const result = await this._requestCancelBookingUseCase.execute(
        userId,
        bookingId,
        reason
      );

      res.status(200).json({
        success: true,
        message: "Cancellation request submitted successfully",
        data: result,
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode || 400).json({
          success: false,
          message: err.message,
        });
      }
    }
  }

  async handleOwnerCancelRequest(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;
      const { requestId, userId } = req.params;
      const { action } = req.body;
      console.log("userrrIddddd", ownerId);

      if (!ownerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
        return;
      }
      if (!requestId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUEST_ID_REQUIRED,
        });
        return;
      }
      if (!["approved", "rejected"].includes(action)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_ACTION,
        });
        return;
      }
      const result = await this._handleOwnerCancelUseCase.execute(
        requestId,
        action,
        userId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          messsage: error.message,
        });
        return;
      }
    }
  }
  async getCancelRequestBookings(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;
      if (!ownerId) {
        throw new CustomError(
          ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
          HTTP_STATUS.UNAUTHORIZED
        );
        return;
      }
      const requests = await this._getCancellBookingsUseCase.execute(ownerId);
      console.log("requesttss", requests);

      res.status(200).json({
        success: true,
        message: "Cancellation requests fetched successfully",
        data: requests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch cancellation requests",
      });
    }
  }
  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const {
        turfId,
        courtType,
        slotDate,
        startTime,
        endTime,
        pricePerPlayer,
      } = req.body;

      const result = await this._createHostedGameUseCase.execute({
        hostUserId: userId,
        turfId,
        courtType,
        slotDate,
        startTime,
        endTime,
        pricePerPlayer,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Game Hosted Successfully",
        game: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to Host game",
      });
    }
  }
  async getUpcomingHostedGames(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = "1",
        limit = "6",
        search = "",
        minPrice,
        maxPrice,
      } = req.query;

      const games = await this._getUpcomingHostedGamesUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      res.status(200).json({
        success: true,
        games,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch upcoming hosted games",
      });
    }
  }
  async joinHostedGame(req: Request, res: Response): Promise<void> {
    try {
      const { gameId } = req.body;
      const userId = (req as CustomRequest).user?.userId;

      if (!gameId || !userId) {
        res.status(400).json({
          success: false,
          message: "Game ID and user ID required",
        });
        return;
      }

      const result = await this._joinHostedGameUsecase.execute({
        gameId,
        userId,
      });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to join game",
      });
    }
  }
  async getSingleHostedGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("idddd", id);

      const game = await this._getSingleHostedGameUseCase.execute(id);

      res.status(200).json({
        success: true,
        game,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch hosted game",
      });
    }
  }
  async holdSlot(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date, startTime, endTime } = req.body;
      const userId = (req as CustomRequest).user?.userId;
      console.log("dataas", userId, date, startTime, endTime);

      await this._holdSlotUseCase.execute(
        turfId,
        date,
        startTime,
        endTime,
        userId
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Slot locked successfully",
      });

    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
}
