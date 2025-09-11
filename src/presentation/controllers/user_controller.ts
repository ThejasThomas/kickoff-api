// import { success } from "zod"
// import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants"
// import { CustomRequest } from "../middlewares/auth_middleware"

import { inject, injectable } from "tsyringe";
import { IUserController } from "../../domain/controllerInterfaces/users/user-controller.interface";
import { IGetAllUsersUseCase } from "../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { Request, Response } from "express";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { success } from "zod";

// async refreshSession(req:Request,res:Response) : Promise<void> {
//     try{
//         const {userId,role} = (req as CustomRequest).user;
//         if(!userId || !role) {
//             res.status(HTTP_STATUS.UNAUTHORIZED).json({
//                 success:false,
//                 message:ERROR_MESSAGES.INVALID_TOKEN
//             })
//             return;
//         }
//     }
// }

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IGetAllUsersUseCase")
    private _getAllUsersUseCase: IGetAllUsersUseCase,
    @inject('IUpdateEntityStatusUseCase')
    private __updateEntityStatusUseCase:IUpdateEntityStatusUseCase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 4,
        search = "",
        role,
        status,
      } = req.query;
              const excludeStatus = req.query['excludeStatus[]'] || req.query.excludeStatus;

      const pageNumber = Math.max(Number(page), 1);
      const pageSize = Math.max(Number(limit), 1);
      const searchTerm = typeof search === "string" ? search : "";

      let excludeStatusArr: string[] = [];
      if (typeof excludeStatus === "string") {
        excludeStatusArr = [excludeStatus];
      } else if (Array.isArray(excludeStatus)) {
        excludeStatusArr = excludeStatus.map(String);
      }

      const roleStr = role === "turfOwner" ? "turfOwner" : "client";

      const { users, totalPages } = await this._getAllUsersUseCase.execute(
        roleStr,
        pageNumber,
        pageSize,
        searchTerm,
        status as string,
        excludeStatusArr
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        users,
        totalPages,
        currentPage: pageNumber,
      });
    } catch(error) {
        handleErrorResponse(req,res,error)
    }
  }

  async updateEntityStatus(req: Request, res: Response): Promise<void> {
   try{
    const {entityType,entityId,status,reason,email} =req.body;
      await this.__updateEntityStatusUseCase.execute(entityType,entityId,status,reason,email);

      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:SUCCESS_MESSAGES.UPDATED
      })
   } catch(error){
        handleErrorResponse(req,res,error)
   }
  }
}
