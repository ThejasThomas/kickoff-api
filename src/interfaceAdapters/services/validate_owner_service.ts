import { ITurfOwnerRepository } from "../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { IValidateOwnerService } from "../../domain/serviceInterfaces/validate_owner_service_interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { inject, injectable } from "tsyringe";
import { ITurfOwnerEntity } from "../../domain/models/turfOwner_entity";

@injectable()
export class ValidateOwnerService implements IValidateOwnerService{
    constructor (
        @inject('ITurfOwnerRepository')
       private _turfOwnerRepository:ITurfOwnerRepository,
       @inject('ITurfRepository')
       private _turfRepository:ITurfRepository,

    ){}

    async ownerExists(ownerId: string): Promise<boolean> {
        const owner =await this._turfOwnerRepository.findOne({ownerId})
        return !!owner
    }
    async findOwner(ownerId: string): Promise<ITurfOwnerEntity> {
        const owner = await this._turfOwnerRepository.findOne({userId:ownerId})

        if(!owner) {
            throw new CustomError(ERROR_MESSAGES.OWNER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);
        }

    //    if (owner.status !== 'active' && owner.status !== 'approved'){
    //         throw new CustomError(ERROR_MESSAGES.OWNER_NOT_ACTIVE,HTTP_STATUS.FORBIDDEN)
    //     }
        return owner;

    }
    async updateOwner(ownerId: string, profileData: Partial<ITurfOwnerEntity>): Promise<ITurfOwnerEntity> {
        const owner =await this._turfOwnerRepository.findOne({userId:ownerId});

        if(!owner) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);
        }
        const updatedData ={
            ...owner,
            ...profileData,
            updatedAt:new Date(),
        }

        const updatedOwner =await this._turfOwnerRepository.update({userId:ownerId},{...profileData, updatedAt: new Date()});
        if(!updatedOwner) {
            throw new CustomError(ERROR_MESSAGES.UPDATE_FAILED,HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return updatedOwner;
    }

    
}