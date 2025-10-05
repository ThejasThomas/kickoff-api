import { inject, injectable } from "tsyringe";
import { IUpdateUserDetailsUseCase } from "../../../domain/useCaseInterfaces/users/update_userdetails_usecase_interface";
import { GetUserDetailsDTO } from "../../dtos/get_userdetails_dto";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateUserDetailsUseCase implements IUpdateUserDetailsUseCase{
    constructor(
        @inject('IClientRepository')
        private _clientRepository:IClientRepository
    ){}

    async execute(userId: string, profileData: GetUserDetailsDTO): Promise<void> {
        const existingUser=await this._clientRepository.findOne({userId:userId})
        if(!existingUser){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND
            )
        }
        const updatedUserDetails=await this._clientRepository.updateOne(userId,profileData)
        console.log(updatedUserDetails)

    }
}