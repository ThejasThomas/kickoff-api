import { inject, injectable } from "tsyringe";
import { ITurfService } from "../../domain/serviceInterfaces/turfService_interface";
import { ITurfEntity } from "../../domain/models/turf_entity";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class TurfService implements ITurfService {
    constructor(
         @inject('ITurfRepository')
        private _turfRepository:ITurfRepository 
    ){
       
    }
    async findTurfById(turfId: string): Promise<ITurfEntity | null> {
        try{
            const turf = await this._turfRepository.findById(turfId)
            if(!turf) {
                throw new CustomError(ERROR_MESSAGES.TURF_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
            }
            return turf
        }catch(error){
            if(error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(ERROR_MESSAGES.DATABASE_ERROR,HTTP_STATUS.INTERNAL_SERVER_ERROR)

        }
    }

    async updateTurf(turfId: string, turfData: Partial<ITurfEntity>): Promise<ITurfEntity> {
        try{

            const updateData = {
        ...turfData,
        pricePerHour: turfData.pricePerHour ? String(turfData.pricePerHour) : undefined,
        updatedAt: new Date(),
      };
            const updatedTurf=await this._turfRepository.update({ _id: turfId },{...updateData,updatedAt:new Date()})
            if(!updatedTurf) {
                throw new CustomError(ERROR_MESSAGES.TURF_NOT_FOUND,HTTP_STATUS.NOT_FOUND);
            }
            return updatedTurf;
        }catch(error){
            if(error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(ERROR_MESSAGES.DATABASE_ERROR,HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }
    }
}