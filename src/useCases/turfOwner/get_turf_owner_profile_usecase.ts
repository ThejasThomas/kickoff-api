import { inject, injectable } from "tsyringe";
import { ITurfOwnerDetailsUseCase } from "../../entities/useCaseInterfaces/turfOwner/get_turf_owner_profile_usecase";
import { IValidateOwnerService } from "../../entities/serviceInterfaces/validate_owner_service_interface";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";

@injectable()
export class TurfOwnerDetailsUseCase implements ITurfOwnerDetailsUseCase{
    constructor(
        @inject('IValidateOwnerService')
        private _validateOwnerService:IValidateOwnerService
    ) {}

    async execute(ownerId: string): Promise<ITurfOwnerEntity> {
        return await this._validateOwnerService.findOwner(ownerId)
    }
}
