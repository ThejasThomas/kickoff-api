import { inject, injectable } from "tsyringe";
import { ITurfController } from "../../domain/controllerInterfaces/turf/turf_controller.interface";
import { Request, Response } from "express";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfs/get_all_turfs_usecase_interface";
import { HTTP_STATUS } from "../../shared/constants";
import { success } from "zod";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { error } from "console";

@injectable()
export class TurfController implements ITurfController {
  constructor(
    @inject("IGetAllTurfsUseCase")
    private _getAllTurfUseCase: IGetAllTurfsUseCase
  ) {}

  async getAllTurfs(req: Request, res: Response): Promise<void> {
    try {

      console.log('hey bro its turf controller')
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
        status as string,
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
}
