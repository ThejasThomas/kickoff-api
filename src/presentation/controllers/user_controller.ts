import { inject, injectable } from "tsyringe";
import { IUserController } from "../../domain/controllerInterfaces/users/user-controller.interface";
import { IGetAllUsersUseCase } from "../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { Request, Response } from "express";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IGetBookedUsersDetails } from "../../domain/useCaseInterfaces/users/get_bookedUsersDetails_interface";
import { IGetUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/get_user_details_usecase_interface";
import { IUpdateUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/update_userdetails_usecase_interface";
import { success } from "zod";
import { CustomError } from "../../domain/utils/custom.error";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IGetAllUsersUseCase")
    private _getAllUsersUseCase: IGetAllUsersUseCase,
    @inject("IUpdateEntityStatusUseCase")
    private __updateEntityStatusUseCase: IUpdateEntityStatusUseCase,
    @inject("IGetBookedUsersDetails")
    private _getBookedUserDetailsUseCase: IGetBookedUsersDetails,
    @inject("IGetUserDetailsUseCase")
    private _getUserDetailsUseCase:IGetUserDetailsUseCase,
    @inject("IUpdateUserDetailsUseCase")
    private _updateUserDetailsUseCase:IUpdateUserDetailsUseCase,
  ) {}

  async refreshSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = (req as CustomRequest).user;
      if (!userId || !role) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
        return;
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 4, search = "", role, status } = req.query;
      const excludeStatus =
        req.query["excludeStatus[]"] || req.query.excludeStatus;

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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try{
      const userId=(req as CustomRequest).user?.userId
      console.log('userId',userId)
      const userDetails=await this._getUserDetailsUseCase.execute(userId)
      res.status(HTTP_STATUS.OK).json(userDetails)
    }catch(error){
      handleErrorResponse(req,res,error)
    }
  }

  async updateUserDetails(req: Request, res: Response): Promise<void> {
    try{
      const userId=(req as CustomRequest).user?.userId
      const profileDate=req.body 
      console.log('profileDataa',profileDate)
      if(!userId){
         res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      const updatedProfile =await this._updateUserDetailsUseCase.execute(userId,profileDate)

      res.status(HTTP_STATUS.OK).json({
        success:true,
        message:SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        data:updatedProfile
      })
    }catch(error){
      if (error instanceof CustomError) {
              res.status(error.statusCode).json({
                success: false,
                message: error.message,
              });
            } else {
              handleErrorResponse(req, res, error);
            }
    }
  }


  async updateEntityStatus(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId, status, reason, email } = req.body;
      const ownerId = req.body.ownerId;
      console.log("iddddddddddddOwwwnerrr", ownerId);
      await this.__updateEntityStatusUseCase.execute(
        entityType,
        entityId,
        status,
        reason,
        email,
        ownerId
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
  async getBookedUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      console.log("userIDDDd", userId);
      if (!userId) {
         res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
      }
        console.log('heyloo bro')
        const userDetails = await this._getBookedUserDetailsUseCase.execute(
          userId
        );
        console.log('userDetails',userDetails)
        res.status(HTTP_STATUS.OK).json(userDetails);
     
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
