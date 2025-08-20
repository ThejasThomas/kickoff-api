import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login_usecase_interface";
import { IAdminEntity } from "../../entities/models/admin_entity";
import { IClientEntity } from "../../entities/models/client_entity";
import { ITurfOwnerEntity } from "../../entities/models/turfOwner_entity";
import { LoginUserDTO } from "../../shared/dtos/user_dto";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt_interface";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterface/users/admin-repository.interface.interface";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        @inject('IClientRepository')
        private _clientRepository:IClientRepository,
        @inject("IPasswordBcrypt") 
        private _passwordBcrypt: IBcrypt,
        @inject('ITurfOwnerRepository')
        private _turfOwnerRepository:ITurfOwnerRepository,
        @inject('IAdminRepository')
        private _adminRepository:IAdminRepository
    ){}

    async execute(user: LoginUserDTO): Promise<Partial<ITurfOwnerEntity | IAdminEntity | IClientEntity>> {
        let repository;

        if(user.role==='client'){
            repository =this._clientRepository;
        }else if(user.role==='turfOwner'){
            repository = this._turfOwnerRepository;
        }else if(user.role==='admin') {
            repository = this._adminRepository;
        }
        else{
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const userData =await repository.findOne({email:user.email});
        if(!userData) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        if(userData.status==='blocked'){
            throw new CustomError(
                ERROR_MESSAGES.BLOCKED,
                HTTP_STATUS.FORBIDDEN
            )
        }

        if (user.password) {
			const isPasswordMatch = await this._passwordBcrypt.compare(
				user.password,
				userData.password
			);
			if (!isPasswordMatch) {
				throw new CustomError(
					ERROR_MESSAGES.INVALID_CREDENTIALS,
					HTTP_STATUS.FORBIDDEN
				);
			}
		}

        return userData;
    }
}