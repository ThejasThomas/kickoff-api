import { inject, injectable } from "tsyringe";
import { IRetryAdminApprovalUseCase } from "../../../domain/useCaseInterfaces/turfOwner/retry_admin_approval_usecase_interface";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { IValidateOwnerService } from "../../../domain/serviceInterfaces/validate_owner_service_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITurfOwnerDTO } from "../../dtos/turfowner_dto";

@injectable()
export class RetryAdminApprovalUseCase implements IRetryAdminApprovalUseCase {
    constructor(
        @inject("ITurfOwnerRepository")
        private _turfOwnerRepository: ITurfOwnerRepository,
        @inject('IValidateOwnerService')
        private _validateOwnerService:IValidateOwnerService
    ) {}

    async execute(userId: string): Promise<ITurfOwnerDTO> {
        try {
            const owner = await this._validateOwnerService.findOwner(userId)
            if (!owner) {
                throw new CustomError(
                    ERROR_MESSAGES.USER_NOT_FOUND,
                    HTTP_STATUS.NOT_FOUND
                );
            }



            const updatedOwner = await this._turfOwnerRepository.updateOwnerStatus(userId, "updated");



            if (!updatedOwner || !updatedOwner.status) {
            throw new CustomError(ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }


            return updatedOwner
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                ERROR_MESSAGES.SERVER_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }
}