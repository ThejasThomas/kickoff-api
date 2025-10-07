import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { ILoginUserUseCase } from "../../../domain/useCaseInterfaces/auth/login_usecase_interface";
import { IAdminEntity } from "../../../domain/models/admin_entity";
import { IClientEntity } from "../../../domain/models/client_entity";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";
import { LoginUserDTO } from "../../dtos/user_dto";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../presentation/security/bcrypt_interface";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { IAdminRepository } from "../../../domain/repositoryInterface/users/admin-repository.interface.interface";

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