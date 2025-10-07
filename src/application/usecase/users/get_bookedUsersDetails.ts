import { inject, injectable } from "tsyringe";
import { IGetBookedUsersDetails } from "../../../domain/useCaseInterfaces/users/get_bookedUsersDetails_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { GetBookedUserDetailsDTO } from "../../dtos/getBookedUserDetails_dto";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { mapBookedUsersDetails } from "../../mappers/getBookedUsersMappers";
import { CustomError } from "../../../domain/utils/custom.error";



@injectable()
export class GetBookedUsersDetails implements IGetBookedUsersDetails {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<GetBookedUserDetailsDTO> {
    const userDetails = await this._clientRepository.findOne({userId:userId});
    console.log('userDetails',userDetails)
    if (!userDetails) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.BAD_REQUEST);
    }

    return mapBookedUsersDetails(userDetails);
  }
}
