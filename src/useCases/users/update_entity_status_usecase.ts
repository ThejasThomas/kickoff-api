import { inject, injectable } from "tsyringe";
import { IUpdateEntityStatusUseCase } from "../../entities/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { hasEmail } from "../../shared/helper/hasEmail";
import { ITokenService } from "../../entities/serviceInterfaces/token_service_interface";

@injectable()
export class UpdateEntityStatusUseCase implements IUpdateEntityStatusUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ITurfOwnerRepository")
    private _turfOwnerRepository: ITurfOwnerRepository
  ) // @inject('ITokenService')
  // private _tokenService:ITokenService
  {}
  async execute(
    entityType: string,
    entityId: string,
    status: string,
    reason?: string,
    email?: string
  ): Promise<void> {
    if (!entityType || !entityId || !status) {
      throw new CustomError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    let repo;

    switch (entityType) {
      case "user":
        repo = this._clientRepository;
        break;
      case "turfOwner":
        repo = this._turfOwnerRepository;
        break;
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        );
    }
    try {
      const entity = await repo.findOne({ userId: entityId });
      console.log("Found entity:", entity);

      if (!entity) {
        throw new CustomError(
          `${entityType} ${ERROR_MESSAGES.USER_NOT_FOUND}`,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const result = await repo.update({ userId: entityId }, { status: status });
      console.log("Update result:", result); 
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
    // if(entityType==='turfOwner' && status ==='rejected' && reason && hasEmail(entity)) {
    //     await this.
    // }
  }

  // private async _handleOwnerRejection(email:string,reason:string):Promise<void> {
  //     const retryToken =this._tokenService.generateResetToken(email)
  //     const retryUrl =new URL(`/`)
  // }
}
