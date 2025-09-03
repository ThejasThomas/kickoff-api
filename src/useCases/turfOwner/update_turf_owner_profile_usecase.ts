import { inject, injectable } from "tsyringe";
import { IUpdateTurfOwnerProfileUseCase } from "../../entities/useCaseInterfaces/turfOwner/update_turf_owner_profile_usecase";
import { IValidateOwnerService } from "../../entities/serviceInterfaces/validate_owner_service_interface";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()

export class UpdateTurfOwnerProfileUseCase implements IUpdateTurfOwnerProfileUseCase {
    constructor(
        @inject('IValidateOwnerService')
        private _validateOwnerService:IValidateOwnerService
    ) {}

    async execute(ownerId: string, profileData: Partial<ITurfOwnerEntity>): Promise<ITurfOwnerEntity> {
        const existingOwner = await this._validateOwnerService.findOwner(ownerId);
        console.log('idddds',)
        if(!existingOwner){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);

        }

        const updatedOwner = await this._validateOwnerService.updateOwner(ownerId,profileData);

        return updatedOwner;
        
    }
}