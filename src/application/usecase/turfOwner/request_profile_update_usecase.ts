import { inject, injectable } from "tsyringe";
import { IRequestUpdateProfileUseCase } from "../../../domain/useCaseInterfaces/turfOwner/request_profile_update_usecase";
import { IValidateOwnerService } from "../../../domain/serviceInterfaces/validate_owner_service_interface";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../domain/utils/custom.error";


@injectable()

export class RequestUpdateProfileUseCase implements IRequestUpdateProfileUseCase {
    constructor(
        @inject('IValidateOwnerService')
        private _validateOwnerService:IValidateOwnerService
    ) {}

    async execute(ownerId: string, profileData: Partial<ITurfOwnerEntity>): Promise<ITurfOwnerEntity> {
        const existingOwner = await this._validateOwnerService.findOwner(ownerId);
        if(!existingOwner){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND);

        }
        
         const updatedProfileData = {
            ...profileData,
            status: "pending" as const,
        };
        const updatedOwner = await this._validateOwnerService.updateOwner(ownerId,updatedProfileData);

        return updatedOwner;
        
    }
}