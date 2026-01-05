import { inject, injectable } from "tsyringe";
import { ITurfController } from "../../domain/controllerInterfaces/turf/turf_controller.interface";
import { Request, Response } from "express";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_all_turfs_usecase_interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_my_turf_usecase_interface";
import { IGetTurfByIdUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_turf_by_id_usecase_interface";
import { IUpdateTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/update_turf_by_id_usecase_interface";
import { IGenerateSlotUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/generateSlotsUseCase";
import { IGetSlotsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_slots_usecase";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { CustomError } from "../../domain/utils/custom.error";
import { IGetNearByTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_nearby_turf_usecase_interface";
import { IAddRulesUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/add_rules_useCase_interface";
import { IGetRulesUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_rules_useCase_interface";
import { ICheckSlotIsBookedUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/checkslotIsBookedUseCase_interface";
import { ICancelSlotUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/cancel_slot_usecase";
import { IOfflineBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/offline_booking_usecase_interface";
import { IAddMoneyOwnerWalletUseCase } from "../../domain/useCaseInterfaces/wallet/add_money_owner_wallet_usecase";
import { IAddReviewUseCase } from "../../domain/useCaseInterfaces/review/add_review_usecase_interface";
import { IGetTurfReviewsUseCase } from "../../domain/useCaseInterfaces/review/get_turf_review_usecase_interface";
import { IDeleteReviewUseCase } from "../../domain/useCaseInterfaces/review/deleteReviewUseCase_interface";
import { IAddRatingUseCase } from "../../domain/useCaseInterfaces/ratings/add_rating_usecase_interface";
import { IGetTurfRatingsUseCase } from "../../domain/useCaseInterfaces/ratings/get_turf_ratings_usecase_interface";

@injectable()
export class TurfController implements ITurfController {
  constructor(
    @inject("IGetAllTurfsUseCase")
    private _getAllTurfUseCase: IGetAllTurfsUseCase,
    @inject("IGetMyTurfsUseCase")
    private _getMyTurfUseCase: IGetMyTurfsUseCase,
    @inject("IGetTurfByIdUseCase")
    private _getTurfByIdUseCase: IGetTurfByIdUseCase,
    @inject("IUpdateTurfUseCase")
    private _updateTurfUseCase: IUpdateTurfUseCase,
    @inject("IGenerateSlotUseCase")
    private _generateSlotsUseCase: IGenerateSlotUseCase,
    @inject("IGetSlotsUseCase")
    private _getSlotsUseCase: IGetSlotsUseCase,
    @inject("IBookSlotUseCase")
    private _bookSlotUseCase: IBookSlotUseCase,
    @inject("IGetNearByTurfUseCase")
    private _getNearbyTurfsUseCase: IGetNearByTurfUseCase,
    @inject("IAddRulesUseCase")
    private _addRulesUseCase: IAddRulesUseCase,
    @inject("IGetRulesUseCase")
    private _getRulesUseCase: IGetRulesUseCase,
    @inject("ICheckSlotIsBookedUseCase")
    private _checkSlotIsBookedUseCase: ICheckSlotIsBookedUseCase,
    @inject("ICancelSlotUseCase")
    private _cancelSlotUseCase: ICancelSlotUseCase,
    @inject("IOfflineBookingsUseCase")
    private _offlineBookingUseCase: IOfflineBookingsUseCase,
    @inject("IAddMoneyOwnerWalletUseCase")
    private _addMoneyOwnerWalletUsecase: IAddMoneyOwnerWalletUseCase,
    @inject("IAddReviewUseCase")
    private _addReviewUseCase: IAddReviewUseCase,
    @inject("IGetTurfReviewsUseCase")
    private _getTurfReviewsUsecase: IGetTurfReviewsUseCase,
    @inject("IDeleteReviewUseCase")
    private _deleteReviewUseCase: IDeleteReviewUseCase,
    @inject("IAddRatingUseCase")
    private _addRatingUseCase: IAddRatingUseCase,
    @inject("IGetTurfRatingsUseCase")
    private _getTurfRatingUseCase: IGetTurfRatingsUseCase
  ) {}

  async getAllTurfs(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 6, search = "", status } = req.query;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";
      console.log("paageeee", pageNumber, "sixeee", pageSize);

      const { turfs, totalPages } = await this._getAllTurfUseCase.execute(
        pageNumber,
        pageSize,
        searchTerm,
        status as string
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        turfs,
        totalPages,
        currentPage: pageNumber,
      });
    } catch {
      handleErrorResponse(req, res, error);
    }
  }
  async getMyTurf(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as CustomRequest).user?.userId;

      if (!ownerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }

      const { page = 1, limit = 4, search = "", status } = req.query;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";
      const statusFilter = typeof status === "string" ? status : undefined;

      const { turfs, totalPages } = await this._getMyTurfUseCase.execute(
        ownerId,
        pageNumber,
        pageSize,
        searchTerm,
        statusFilter
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        turfs,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getTurfById(req: Request, res: Response): Promise<void> {
    try {
      const turfId = req.params.id;
      const ownerId = (req as CustomRequest).user?.userId;
      if (!turfId || !ownerId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
      const turf = await this._getTurfByIdUseCase.execute(turfId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        turf,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async updateTurf(req: Request, res: Response): Promise<void> {
    try {
      const turfId = req.params.id;
      const turfData = req.body;

      if (!turfId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      const isRetryUpdate = turfData.isRetryUpdate || false;
      const retryToken = turfData.retryToken || null;

      delete turfData.isRetryUpdate;
      delete turfData.retryToken;
      delete turfData.status;
      const updatedTurf = await this._updateTurfUseCase.execute(
        turfId,
        turfData,
        isRetryUpdate,
        retryToken
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: isRetryUpdate
          ? SUCCESS_MESSAGES.TURF_UPDATED_SUCCESSFULLY
          : SUCCESS_MESSAGES.TURF_RETRY_UPDATED_SUCCESSFULLY,
        data: updatedTurf,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async generateSlots(req: Request, res: Response): Promise<void> {
    try {
      const {
        turfId,
        date,
        startTime,
        endTime,
        slotDuration,
        price,
        selectedDate,
        endDate,
      } = req.body;
      console.log("daaaataassssssss", req.body);
      const ownerId = (req as CustomRequest).user?.userId;
      console.log("ownerrrIDDDD", ownerId, "turfIDDDDD", turfId);
      const slots = await this._generateSlotsUseCase.execute(
        turfId,
        ownerId,
        date,
        selectedDate,
        endDate,
        startTime,
        endTime,
        slotDuration,
        price
      );
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Slots generated successfully",
        slots,
      });
    } catch (error) {
      console.log(error);
      handleErrorResponse(req, res, error);
    }
  }

  async getSlots(req: Request, res: Response): Promise<void> {
    try {
      const turfId = req.params.id;
      const { date } = req.query;
      console.log("turffIDDD", turfId);

      if (!turfId || !date || typeof date !== "string") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      const dateObj = new Date(date);
      const dayIndex = dateObj.getDay();

      const slots = await this._getSlotsUseCase.execute(
        turfId,
        date as string,
        dayIndex
      );
      console.log("Slotttsssss", slots);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        slots,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getnearbyturfs(req: Request, res: Response): Promise<void> {
    try {
      const {
        latitude,
        longitude,
        page = 1,
        limit = 10,
        search = "",
      } = req.query;

      console.log("latitude", "longitude", latitude, longitude);

      if (!latitude || !longitude) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.LATITUDE_LONGITUDE_REQUIRED,
        });
        return;
      }

      const result = await this._getNearbyTurfsUseCase.execute(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        search as string
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        turfs: result.turfs,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error("Error fetching nearby turfs:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async bookslots(req: Request, res: Response): Promise<void> {
    try {
      const bookData = req.body;
      const userId = (req as CustomRequest).user?.userId;
      console.log("userrrrrrID", userId);
      console.log("bookDAAtaaa", bookData.ownerId);

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      console.log("bookdataaaaas", bookData);
      const bookslot = await this._bookSlotUseCase.execute(bookData, userId);

      await this._addMoneyOwnerWalletUsecase.execute(bookslot._id);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.TURF_BOOKED_SUCCESSFULLY,
        data: bookslot,
      });
    } catch (error) {
      console.error("Error in addTurf controller", error);

      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async addrules(req: Request, res: Response): Promise<void> {
    try {
      const rules = req.body;
      console.log("this are the rules", rules);
      const ownerId = (req as CustomRequest).user?.userId;

      if (!ownerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      rules.ownerId = ownerId;
      console.log("rrrrruulless", rules.turfId, rules.slotDuration);
      if (
        !rules.turfId ||
        !rules.slotDuration ||
        !rules.price ||
        !rules.weeklyRules
      ) {
        throw new CustomError(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const addedRules = await this._addRulesUseCase.execute(rules);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Rules added or updated successfullly",
        data: addedRules,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }
  async getrules(req: Request, res: Response): Promise<void> {
    try {
      const turfId = req.params.id;

      if (!turfId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
      const rules = await this._getRulesUseCase.execute(turfId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        rules,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async checkIsSlotBooked(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date, startTime, endTime } = req.query;

      const result = await this._checkSlotIsBookedUseCase.execute(
        turfId as string,
        date as string,
        startTime as string,
        endTime as string
      );
      console.log("result", result);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Slot availability checked suuccessfully",
        result,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async cancelSlot(req: Request, res: Response): Promise<void> {
    try {
      const { turfId, date, startTime, endTime } = req.body;

      await this._cancelSlotUseCase.execute({
        turfId,
        date,
        startTime,
        endTime,
      });

      res.status(200).json({
        success: true,
        message: "Slot cancelled successfully",
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async bookslotsoffline(req: Request, res: Response): Promise<void> {
    try {
      const bookData = req.body;
      const userId = (req as CustomRequest).user?.userId;
      console.log("userrrrrrID", userId);
      console.log("bookDAAtaaa", bookData);

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }

      if (bookData.isOffline === true) {
        bookData.paymentStatus = "pending";
        bookData.paymentMethod = "offline";
      }
      console.log("bookdataaaaas", bookData);
      const bookslot = await this._offlineBookingUseCase.execute(
        bookData,
        userId
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.TURF_BOOKED_SUCCESSFULLY,
        data: bookslot,
      });
    } catch (error) {
      console.error("Error in addTurf controller", error);

      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }
  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { turfId, bookingId, comment } = req.body;

      const review = await this._addReviewUseCase.execute({
        userId,
        turfId,
        bookingId,
        comment,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        review,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to add review",
      });
    }
  }
  async getTurfReviews(req: Request, res: Response): Promise<void> {
    const { turfId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);

    const data = await this._getTurfReviewsUsecase.execute(turfId, page, limit);

    res.status(200).json({
      success: true,
      ...data,
    });
  }
  async getTurfReviewsForAdmin(req: Request, res: Response): Promise<void> {
    const { turfId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);

    const result = await this._getTurfReviewsUsecase.execute(
      turfId,
      page,
      limit
    );
    res.status(200).json({
      success: true,
      ...result,
    });
  }
  async deleteReviewAdmin(req: Request, res: Response): Promise<void> {
    const { reviewId } = req.params;

    await this._deleteReviewUseCase.execute(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfullt",
    });
  }
  async addRating(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId;
      const { turfId, bookingId, rating } = req.body;

      const result = await this._addRatingUseCase.execute({
        userId,
        turfId,
        bookingId,
        rating,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        rating: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to add rating",
      });
    }
  }
  async getTurfRatings(req: Request, res: Response): Promise<void> {
    try {
      const { turfId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      console.log('turffIddddddd',turfId)

      const result = await this._getTurfRatingUseCase.execute(
        turfId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch turf ratings",
      });
    }
  }
}
