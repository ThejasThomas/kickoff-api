import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_existence_service_interface";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";

@injectable()
export class UserExistenceService implements IUserExistenceService {
    constructor (
        @inject('IClientRepository')
        private _clientRepository:IClientRepository

    ){}

    async emailExists(email: string): Promise<boolean> {
        const [client] =await Promise.all([
            this._clientRepository.findOne({email})
        ])

        return Boolean(client)
    }
}