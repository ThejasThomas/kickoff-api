import { inject, injectable } from "tsyringe";
import { ITurfOwnerDetailsUseCase } from "../../domain/useCaseInterfaces/turfOwner/get_turf_owner_profile_usecase";
import { IValidateOwnerService } from "../../domain/serviceInterfaces/validate_owner_service_interface";
import { mapOwnerDetails } from "../../presentation/mappers/ownerdetails";
import { IOwnerDTO } from "../../presentation/dtos/owner_dto";

@injectable()
export class TurfOwnerDetailsUseCase implements ITurfOwnerDetailsUseCase{
    constructor(
        @inject('IValidateOwnerService')
        private _validateOwnerService:IValidateOwnerService
    ) {}

    async execute(ownerId: string): Promise<IOwnerDTO> {
        const ownerDetails= await this._validateOwnerService.findOwner(ownerId)
        console.log('ownerrDetails',ownerDetails)
        return mapOwnerDetails(ownerDetails)
    }
}
