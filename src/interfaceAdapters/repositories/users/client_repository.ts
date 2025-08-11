import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ClientModel, IClientModel } from "../../../frameworks/database/mongoDb/models/client_model";
import { IClientRepository } from "../../../entities/repositoryInterface/users/client-repository.interface";

@injectable()
export class ClientRepository extends BaseRepository<IClientModel> implements IClientRepository{
    constructor(){
        super(ClientModel)
    }
}