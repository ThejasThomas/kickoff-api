import { inject, injectable } from "tsyringe";
import { ITurfController } from "../../domain/controllerInterfaces/turf/turf_controller.interface";
import { Request, Response } from "express";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfs/get_all_turfs_usecase_interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";
import { CustomRequest } from "../middlewares/auth_middleware";
import { success } from "zod";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfs/get_my_turf_usecase_interface";
import { IGetTurfByIdUseCase } from "../../domain/useCaseInterfaces/turfs/get_turf_by_id_usecase_interface";
import tr from "zod/v4/locales/tr.cjs";
import { IUpdateTurfUseCase } from "../../domain/useCaseInterfaces/turfs/update_turf_by_id_usecase_interface";
import { IGenerateSlotUseCase } from "../../domain/useCaseInterfaces/turfs/generateSlotsUseCase";
import { IGetSlotsUseCase } from "../../domain/useCaseInterfaces/turfs/get_slots_usecase";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { CustomError } from "../../domain/utils/custom.error";

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
    private _bookSlotUseCase: IBookSlotUseCase
  ) {}

  async getAllTurfs(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "", status } = req.query;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";
      //  let excludeArray: string[] = [];
      // if (typeof excludeStatus === "string") {
      //   excludeArray = excludeStatus.split(",").map((s) => s.trim());
      // }

      const { turfs, totalPages } = await this._getAllTurfUseCase.execute(
        pageNumber,
        pageSize,
        searchTerm,
        status as string
        // excludeArray
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
      console.log("ownerrrrIIddd", ownerId, "turfIdddddd", turfId);
      console.log("turffffIDDDDDD", turfId);
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

      if (!turfId || !date) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }

      const slots = await this._getSlotsUseCase.execute(turfId, date as string);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        slots,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async bookslots(req: Request, res: Response): Promise<void> {
    try {
      const bookData = req.body;
      const userId = (req as CustomRequest).user?.userId;
      console.log("userrrrrrID", userId);

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
          success:false,
          message:ERROR_MESSAGES.SERVER_ERROR,
        })
      }
    }
  }
}
