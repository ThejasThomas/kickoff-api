import { inject, injectable } from "tsyringe";
import { ITurfOwnerController } from "../../domain/controllerInterfaces/owner/owner-contoller.interface";
import { IAddTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom.error";
import { handleErrorResponse } from "../../shared/utils/error_handler";
import { ITurfOwnerDetailsUseCase } from "../../domain/useCaseInterfaces/turfOwner/get_turf_owner_profile_usecase";
import { IUpdateTurfOwnerProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/update_turf_owner_profile_usecase";
import { IRetryAdminApprovalUseCase } from "../../domain/useCaseInterfaces/turfOwner/retry_admin_approval_usecase_interface";
import { IRequestUpdateProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/request_profile_update_usecase";

@injectable()
export class TurfOwnerController implements ITurfOwnerController {
  constructor(
    @inject("IAddTurfUseCase")
    private _addTurfUSeCase: IAddTurfUseCase,
    @inject('ITurfOwnerDetailsUseCase')
    private _ownerDetailsUseCase:ITurfOwnerDetailsUseCase,
    @inject('IUpdateTurfOwnerProfileUseCase')
    private _updateTurfOwnerProfileUseCase:IUpdateTurfOwnerProfileUseCase,
    @inject('IRetryAdminApprovalUseCase')
    private __retryAdminApprovalUseCase:IRetryAdminApprovalUseCase,
    @inject('IRequestUpdateProfileUseCase')
    private _requestupdateprofile:IRequestUpdateProfileUseCase

  ) {}

  async addTurf(req: Request, res: Response): Promise<void> {
    try {
      const turfData = req.body;
      const ownerId = (req as CustomRequest).user?.userId;

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

    async getOwnerDetails(req: Request, res: Response): Promise<void> {
      try{
      const ownerId = (req as CustomRequest).user?.userId;
          if(!ownerId){
             res.status(HTTP_STATUS.UNAUTHORIZED).json({
              success:false,
              message:ERROR_MESSAGES.UNAUTHORIZED_ACCESS
            })
          }
          const profile = await this._ownerDetailsUseCase.execute(ownerId)
          res.status(HTTP_STATUS.OK).json(profile)
      } catch(error){
          handleErrorResponse(req,res,error)
      }
    }

    async updateTurfOwnerProfile(req:Request,res:Response): Promise<void>{
          try{
            const ownerId = (req as CustomRequest).user?.userId;
            const profileData=req.body;
            console.log('profileDate',profileData)

            if(!ownerId) {
              res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success:false,
                message:ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
              })
              return;
            }
            
            const updatedProfile = await this._updateTurfOwnerProfileUseCase.execute(ownerId,profileData)
            console.log('updatedProfile',updatedProfile)
            res.status(HTTP_STATUS.OK).json({
              success:true,
              message:SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
              data:updatedProfile,
            })
          }
          catch(error){
            console.error("Error in updatedTurfprofile contoller",error);
            if(error instanceof CustomError) {
              res.status(error.statusCode).json({
                success:false,
                message:error.message,
              })
            } else {
              handleErrorResponse(req,res,error)
              }
            }
            
          }

         async requestUpdateProfile(req: Request, res: Response): Promise<void> {
            try{
            const ownerId = (req as CustomRequest).user?.userId;
            const profileData=req.body;
            console.log('ownerrrId',ownerId,'Profiledaataa',profileData)

            if(!ownerId) {
              res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success:false,
                message:ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
              })
              return;
            }
            
            const updatedProfile = await this._requestupdateprofile.execute(ownerId,profileData)
            res.status(HTTP_STATUS.OK).json({
              success:true,
              message:SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
              data:updatedProfile,
            })
          }
          catch(error){
            console.error("Error in updatedTurfprofile contoller",error);
            if(error instanceof CustomError) {
              res.status(error.statusCode).json({
                success:false,
                message:error.message,
              })
            } else {
              handleErrorResponse(req,res,error)
              }
            }
          }

          async retryAdminApproval(req:Request,res:Response):
          Promise<void> {
            try{
              const ownerId=(req as CustomRequest).user?.userId;


              if(!ownerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                  success:false,
                  message:ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
              }
              const result= await this.__retryAdminApprovalUseCase.execute(ownerId);
              res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.APPROVAL_REQUEST_SENT,
                data:result
              })
            } catch (error) {
      console.error("Error in retryAdminApproval controller", error);
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
    }


