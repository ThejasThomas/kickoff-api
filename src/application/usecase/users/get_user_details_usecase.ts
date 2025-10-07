import { inject, injectable } from "tsyringe";
import { IGetUserDetailsUseCase } from "../../../domain/useCaseInterfaces/users/get_user_details_usecase_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { GetUserDetailsDTO } from "../../dtos/get_userdetails_dto";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { mapGetUserDetails } from "../../mappers/getUserDetailsMapper";

@injectable()
export class GetUserDetailsUseCase implements IGetUserDetailsUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<GetUserDetailsDTO> {
    const userDetails = await this._clientRepository.findOne({
      userId: userId,
    });
    if (!userDetails) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
      
    }
    return mapGetUserDetails(userDetails)
  }
}
