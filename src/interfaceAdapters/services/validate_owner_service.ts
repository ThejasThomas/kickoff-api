import { email } from "zod";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { IValidateOwnerService } from "../../entities/serviceInterfaces/validate_owner_service_interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITurfEntity } from "../../entities/models/turf_entity";
import { ITurfRepository } from "../../entities/repositoryInterface/Turf/turf_repository_interface";
import { inject, injectable } from "tsyringe";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";

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
        console.log('statussss',owner.status)

       if (owner.status !== 'active' && owner.status !== 'approved'){
            throw new CustomError(ERROR_MESSAGES.OWNER_NOT_ACTIVE,HTTP_STATUS.FORBIDDEN)
        }
        console.log('owner validation passed:')
        return owner;

    }
    // async validateTufData(turfData: ITurfEntity): Promise<void> {
    //     await this.
    // }

    
}