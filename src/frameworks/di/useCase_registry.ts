// src/frameworks/di/useCaseRegistry.ts
import { container } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { sendOtpEmailUseCase } from "../../useCases/auth/send_otp_email_useCase";

import { IOtpService } from "../../entities/serviceInterfaces/otp-service_interface";
import { OtpService } from "../../interfaceAdapters/services/otp_service";
import { IBcrypt } from "../security/bcrypt_interface";
import { PasswordBcrypt } from "../security/passsword_bcrypt";
import { OtpBcrypt } from "../security/otp_bcrypt";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_existence_service_interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence_service";
import { IEmailService } from "../../entities/serviceInterfaces/email_service_interface";
import { EmailService } from "../../interfaceAdapters/services/email_service";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify_otp_usecase_interface";
import { VerifyOtpUseCase } from "../../useCases/auth/verify_otp_usecase";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase_interface";
import { RegisterUserUseCase } from "../../useCases/auth/register_user_usecase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login_usecase_interface";
import { LoginUserUseCase } from "../../useCases/auth/login_user_usecase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate_token_usecase_interface";
import { GenerateTokenUseCase } from "../../useCases/auth/generate_token_usecase";
import { ITokenService } from "../../entities/serviceInterfaces/token_service_interface";
import { JWTService } from "../../interfaceAdapters/services/jwt_service";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh-token-repository.interface";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh_token_usecase_interface";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh_token_usecase";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google_usecase";
import { GoogleUseCase } from "../../useCases/auth/google_usecase";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send_email_usecase_interface";
import { SendEmailUseCase } from "../../useCases/common/send_email_usecase";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot_password_usecase_interface";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgotPassword_usecase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/reset_password_usecase_interface";
import { ResetPasswordUseCase } from "../../useCases/auth/resetpassword_usecase";

export class UseCaseRegistry {
  static registerUseCases(): void {
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
      useClass: sendOtpEmailUseCase,
    });

        container.register<IBcrypt>('IPasswordBcrypt',{
            useClass:PasswordBcrypt
        })

        container.register<IBcrypt>('IOtpBcrypt',{
            useClass:OtpBcrypt
        })

         container.register<IUserExistenceService>('IUserExistenceService',{
            useClass:UserExistenceService
        })
        container.register<IEmailService>('IEmailService', {
          useClass:EmailService
        })
        container.register<IVerifyOtpUseCase>('IVerifyOtpUseCase', {
          useClass:VerifyOtpUseCase
        })

        container.register<IRegisterUserUseCase>('IRegisterUserUseCase', {
          useClass:RegisterUserUseCase
        })
        container.register<ILoginUserUseCase>('ILoginUserUseCase',{
          useClass:LoginUserUseCase
        })
        container.register<IGenerateTokenUseCase>('IGenerateTokenUseCase',{
          useClass:GenerateTokenUseCase
        })
        container.register<ITokenService>('ITokenService',{
          useClass:JWTService
        })
        container.register<IRefreshTokenUseCase>('IRefreshTokenUseCase',{
          useClass:RefreshTokenUseCase
        })
        container.register<IGoogleUseCase>('IGoogleUseCase',{
          useClass:GoogleUseCase
        })
        container.register<ISendEmailUseCase>('ISendEmailUseCase',{
          useClass:SendEmailUseCase
        })
        container.register<IForgotPasswordUseCase>('IForgotPasswordUseCase',{
          useClass:ForgotPasswordUseCase
        })
        container.register<IResetPasswordUseCase>('IResetPasswordUseCase',{
          useClass:ResetPasswordUseCase
        })
  }
}
