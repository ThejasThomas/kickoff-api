import { inject, injectable } from "tsyringe";
import { IUpdateTurfUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/update_turf_by_id_usecase_interface";
import { ITurfEntity } from "../../../domain/models/turf_entity";
import { ITurfService } from "../../../domain/serviceInterfaces/turfService_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class UpdateTurfUseCase implements IUpdateTurfUseCase {
    constructor(
      @inject('ITurfService')
      private _turfService:ITurfService
    ){}
    async execute(turfId: string, TurfData: Partial<ITurfEntity>,isRetryUpdate:boolean =false,retryToken?:string): Promise<ITurfEntity> {
            const existingTurf = await this._turfService.findTurfById(turfId)
            if(!existingTurf) {
                throw new CustomError(ERROR_MESSAGES.TURF_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
            }

            if (isRetryUpdate) {
      console.log('Processing retry update for turf:', turfId);
      //       if (retryToken) {
      //   // You can add token validation logic here if required
      //   // const isValidToken = this._tokenService.verifyResetToken(retryToken);
      //   // if (!isValidToken) {
      //   //   throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
      //   // }
      // }
      console.log('satus',turfId)

      TurfData.status='pending';
      
            }

            const updatedTurf = await this._turfService.updateTurf(turfId,TurfData)

            return updatedTurf;
    }
} 