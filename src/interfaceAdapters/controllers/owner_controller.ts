import { inject, injectable } from "tsyringe";
import { ITurfOwnerController } from "../../entities/controllerInterfaces/owner/owner-contoller.interface";
import { IAddTurfUseCase } from "../../entities/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { success } from "zod";
import { CustomError } from "../../entities/utils/custom.error";

@injectable()
export class TurfOwnerController implements ITurfOwnerController {
  constructor(
    @inject("IAddTurfUseCase")
    private _addTurfUSeCase: IAddTurfUseCase
  ) {}

  async addTurf(req: Request, res: Response): Promise<void> {
    try {
      const turfData = req.body;
      // console.log("req.body", turfData);
      const ownerId = (req as CustomRequest).user?.userId;
      // console.log("req.body---", req.body);
      console.log('ownerrrrrr iddd',ownerId)

      if (!ownerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }

      if (!turfData.turfName || !turfData.description || !turfData.location) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
        });
        return;
      }
      const newTurf = await this._addTurfUSeCase.execute(turfData, ownerId);

      res.status(HTTP_STATUS.CREATED).json({
        success:true,
        message:SUCCESS_MESSAGES.TURF_ADDED_SUCCESSFULLY,
        data:newTurf
      })
    } catch(error) {
        console.error("Error in addTurf controller",error);

        if(error instanceof CustomError) {
            res.status(error.statusCode).json({
                success:false,
                message:error.message
            })
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:ERROR_MESSAGES.SERVER_ERROR,
                
            })
        }
        
    }
  }
}
