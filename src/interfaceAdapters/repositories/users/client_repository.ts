import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ClientModel, IClientModel } from "../../database/mongoDb/models/client_model";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { IClientEntity } from "../../../domain/models/client_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ClientRepository extends BaseRepository<IClientModel> implements IClientRepository{
    constructor(){
        super(ClientModel)
    }
    async findbyUserId(id: string): Promise<IClientEntity> {
         const user=await this.model.findOne({userId:id})
         if(!user){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
         }
         return user
     }
     
}