import { inject, injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../../domain/useCaseInterfaces/auth/forgot_password_usecase_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { IAdminRepository } from "../../../domain/repositoryInterface/users/admin-repository.interface.interface";
import { IEmailService } from "../../../domain/serviceInterfaces/email_service_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { config } from "../../../shared/config";
import { ITokenService } from "../../../domain/serviceInterfaces/token_service_interface";
import { IRedisTokenRepository } from "../../../domain/repositoryInterface/redis/redis_token_repository_interface";


@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject('IClientRepository')
        private _clientRepository:IClientRepository,
        @inject('ITurfOwnerRepository')
        private _turfOwnerRepository:ITurfOwnerRepository,
        @inject('IAdminRepository')
        private _adminRepository:IAdminRepository,
        @inject('IEmailService')
        private _emailService:IEmailService,
        @inject('ITokenService') 
        private _tokenService:ITokenService,
        @inject('IRedisTokenRepository')
        private _redisTokenRepository:IRedisTokenRepository,
    ){}

    async execute({ email, role }: { email: string; role: string; }): Promise<void> {
        let repository;
        if(role ==='client') {
            repository=this._clientRepository
        } else if(role === 'turfOwner') {
            repository=this._turfOwnerRepository
        } else if(role === 'admin') {
            repository=this._adminRepository
        } else {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.FORBIDDEN
            )
        }
        const user =await repository.findOne({ email });
        if(!user) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        const resetToken =this._tokenService.generateResetToken(email);

        try{
            await this._redisTokenRepository.storeResetToken(
                user.userId ?? "",
                resetToken
            )
        } catch (error){
            console.error('Failed to store reset token in Redis:',error);
            throw new CustomError(
                ERROR_MESSAGES.SERVER_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
        }

        const rolePrefix =role !=='client' ? `/${role}`:"";
        const resetUrl =new URL(
            `${rolePrefix}/reset-password/${resetToken}`,
            config.cors.ALLOWED_ORIGIN
        ).toString();

        await this._emailService.sendResetEmail(
            email,
            "KickOFF - Reset your password",
            resetUrl
        )
    }
}