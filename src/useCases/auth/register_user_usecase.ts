import { inject, injectable } from "tsyringe";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase_interface";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";
import { UserDTO } from "../../shared/dtos/user_dto";
import { IClientEntity } from "../../entities/models/client_entity";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_existence_service_interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt_interface";
import { generateUniqueId } from "../../shared/utils/unique_uuid.helper";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        @inject('IClientRepository')
        private _clientRepository:IClientRepository,
        @inject('ITurfOwnerRepository')
        private _turfOwnerRepository:ITurfOwnerRepository,
        @inject('IUserExistenceService')
        private _userExistenceService:IUserExistenceService,
        @inject('IPasswordBcrypt') private _passwordBcrypt:IBcrypt
    ){}

    async execute(user:UserDTO):Promise<IClientEntity |ITurfOwnerEntity| null> {
        const {role,email,password} =user;
        const isEmailExisting = await this._userExistenceService.emailExists(email);
        if(isEmailExisting) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS,HTTP_STATUS.CONFLICT)
        }

        const hashedPassword =password? await this._passwordBcrypt.hash(password):null;

        const userId=generateUniqueId()

        let repository;
        if(role==='client'){
            repository =this._clientRepository;
        }else if(role==='turfOwner'){
            repository =this._turfOwnerRepository;
        }else{
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        return await repository.save({
      ...user,
      password: hashedPassword ?? "",
      userId,
    });

    }
}

