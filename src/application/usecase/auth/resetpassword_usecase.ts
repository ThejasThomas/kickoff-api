import { inject, injectable } from "tsyringe";
import { IResetPasswordUseCase } from "../../../domain/useCaseInterfaces/auth/reset_password_usecase_interface";
import { IAdminRepository } from "../../../domain/repositoryInterface/users/admin-repository.interface.interface";
import { IBcrypt } from "../../../presentation/security/bcrypt_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITokenService } from "../../../domain/serviceInterfaces/token_service_interface";
import { ResetTokenPayload } from "../../../interfaceAdapters/services/jwt_service";
import { IPasswordResetTokenRepository } from "../../../domain/repositoryInterface/passwordResetToken/password_reset_token_repository";

@injectable()

export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject('IClientRepository')
        private _clientRepository:IClientRepository,
        @inject('ITurfOwnerRepository')
        private _turfOwnerRepository:ITurfOwnerRepository,
        @inject('IAdminRepository')
        private _adminRepository:IAdminRepository,
        @inject('IPasswordBcrypt')
        private _passwordBcrypt:IBcrypt,
        @inject("ITokenService")
        private _tokenService: ITokenService,
        @inject('IPasswordResetTokenRepository')
        private _redisTokenRepository:IPasswordResetTokenRepository

    ){}

    async execute({ password, role, token, }: { password: string; role: string; token: string; }): Promise<void> {

        const payload = this._tokenService.verifyResetToken(
            token
        ) as ResetTokenPayload;
        if(!payload || !payload.email) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const email = payload.email;
        let repository;
        if(role ==='client') {
            repository = this._clientRepository;
        } else if(role ==='turfOwner') {
            repository = this._turfOwnerRepository
        } else if(role ==='admin') {
            repository=this._adminRepository
        } else {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.FORBIDDEN
            )
        }
        const user =await repository.findOne({email})
        if(!user) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const tokenValid = await this._redisTokenRepository.verifyResetToken(
            user.userId ?? "",
            token
        )
        if(!tokenValid){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const isSamePasswordAsOld = await this._passwordBcrypt.compare(
            password,
            user.password
        )
        if(isSamePasswordAsOld){
            throw new CustomError(
                ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const hashedPassword = await this._passwordBcrypt.hash(password)
        await repository.update({email},{password:hashedPassword});
        
    }
}