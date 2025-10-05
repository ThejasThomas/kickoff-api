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
    private _getRulesUseCase: IGetRulesUseCase
  ) {}

  async getAllTurfs(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "", status } = req.query;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";
      console.log('paageeee',pageNumber,   'sixeee',  pageSize,     )

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

      const { page = 1, limit = 8, search = "", status } = req.query;

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
      console.log('turffIDDD',turfId)

      if (!turfId || !date||typeof date !== "string") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
       const dateObj=new Date(date)
            const dayIndex =dateObj.getDay()

      const slots = await this._getSlotsUseCase.execute(turfId, date as string,dayIndex);
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
      console.log('bookDAAtaaa',bookData)

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      console.log("bookdataaaaas", bookData);
      const bookslot = await this._bookSlotUseCase.execute(bookData, userId);

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
      console.log('rrrrruulless',rules.turfId,rules.slotDuration)
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
}
