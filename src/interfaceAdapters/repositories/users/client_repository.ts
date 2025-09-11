import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ClientModel, IClientModel } from "../../database/mongoDb/models/client_model";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";

@injectable()
export class ClientRepository extends BaseRepository<IClientModel> implements IClientRepository{
    constructor(){
        super(ClientModel)
    }
}