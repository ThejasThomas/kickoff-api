// src/frameworks/di/useCaseRegistry.ts
import { container } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../domain/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { sendOtpEmailUseCase } from "../../application/auth/send_otp_email_useCase";

import { IOtpService } from "../../domain/serviceInterfaces/otp-service_interface";
import { OtpService } from "../../interfaceAdapters/services/otp_service";
import { IBcrypt } from "../security/bcrypt_interface";
import { PasswordBcrypt } from "../security/passsword_bcrypt";
import { OtpBcrypt } from "../security/otp_bcrypt";
import { IUserExistenceService } from "../../domain/serviceInterfaces/user_existence_service_interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence_service";
import { IEmailService } from "../../domain/serviceInterfaces/email_service_interface";
import { EmailService } from "../../interfaceAdapters/services/email_service";
import { IVerifyOtpUseCase } from "../../domain/useCaseInterfaces/auth/verify_otp_usecase_interface";
import { VerifyOtpUseCase } from "../../application/auth/verify_otp_usecase";
import { IRegisterUserUseCase } from "../../domain/useCaseInterfaces/auth/register_usecase_interface";
import { RegisterUserUseCase } from "../../application/auth/register_user_usecase";
import { ILoginUserUseCase } from "../../domain/useCaseInterfaces/auth/login_usecase_interface";
import { LoginUserUseCase } from "../../application/auth/login_user_usecase";
import { IGenerateTokenUseCase } from "../../domain/useCaseInterfaces/auth/generate_token_usecase_interface";
import { GenerateTokenUseCase } from "../../application/auth/generate_token_usecase";
import { ITokenService } from "../../domain/serviceInterfaces/token_service_interface";
import { JWTService } from "../../interfaceAdapters/services/jwt_service";
import { IRefreshTokenUseCase } from "../../domain/useCaseInterfaces/auth/refresh_token_usecase_interface";
import { RefreshTokenUseCase } from "../../application/auth/refresh_token_usecase";
import { IGoogleUseCase } from "../../domain/useCaseInterfaces/auth/google_usecase";
import { GoogleUseCase } from "../../application/auth/google_usecase";
import { ISendEmailUseCase } from "../../domain/useCaseInterfaces/common/send_email_usecase_interface";
import { SendEmailUseCase } from "../../application/common/send_email_usecase";
import { IForgotPasswordUseCase } from "../../domain/useCaseInterfaces/auth/forgot_password_usecase_interface";
import { ForgotPasswordUseCase } from "../../application/auth/forgotPassword_usecase";
import { IResetPasswordUseCase } from "../../domain/useCaseInterfaces/auth/reset_password_usecase_interface";
import { ResetPasswordUseCase } from "../../application/auth/resetpassword_usecase";
import { IGetAllUsersUseCase } from "../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import { GetAllUsersUseCase } from "../../application/users/get_all_users_usecase";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { UpdateEntityStatusUseCase } from "../../application/users/update_entity_status_usecase";
import { IAddTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { AddTurfUseCase } from "../../application/turfOwner/add_turf_usecase";
import { IValidateOwnerService } from "../../domain/serviceInterfaces/validate_owner_service_interface";
import { ValidateOwnerService } from "../../interfaceAdapters/services/validate_owner_service";
import { ICloudinarySignatureService } from "../../domain/serviceInterfaces/cloudinary_service_interface";
import { CloudinarySignatureService } from "../../interfaceAdapters/services/cloudinary_service";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_all_turfs_usecase_interface";
import { GetAllTurfsUsecase } from "../../application/turfs/get_all_turf_usecase";
import { TurfOwnerDetailsUseCase } from "../../application/turfOwner/get_turf_owner_profile_usecase";
import { ITurfOwnerDetailsUseCase } from "../../domain/useCaseInterfaces/turfOwner/get_turf_owner_profile_usecase";
import { IUpdateTurfOwnerProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/update_turf_owner_profile_usecase";
import { UpdateTurfOwnerProfileUseCase } from "../../application/turfOwner/update_turf_owner_profile_usecase";
import { IRetryAdminApprovalUseCase } from "../../domain/useCaseInterfaces/turfOwner/retry_admin_approval_usecase_interface";
import { RetryAdminApprovalUseCase } from "../../application/turfOwner/retry_admin_approval_usecase";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_my_turf_usecase_interface";
import { GetMyTurfsUseCase } from "../../application/turfs/get_my_turf_usecase";
import { IGetTurfByIdUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_turf_by_id_usecase_interface";
import { GetTurfByIdUseCase } from "../../application/turfs/get_turf_by_id_usecase";
import { IUpdateTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/update_turf_by_id_usecase_interface";
import { UpdateTurfUseCase } from "../../application/turfs/update_turf_by_id_usecase";
import { ITurfService } from "../../domain/serviceInterfaces/turfService_interface";
import { TurfService } from "../../interfaceAdapters/services/turf_service";
import { IRequestUpdateProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/request_profile_update_usecase";
import { RequestUpdateProfileUseCase } from "../../application/turfOwner/request_profile_update_usecase";
import { IGenerateSlotUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/generateSlotsUseCase";
import { GenerateSlotUseCase } from "../../application/turfs/generate_slots_usecase";
import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { SlotService } from "../../interfaceAdapters/services/slot_service";
import { IGetSlotsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_slots_usecase";
import { GetSlotsUseCase } from "../../application/turfs/get_slot_usecase";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { BookSlotUseCase } from "../../application/Bookings/book_slot_usecase";
import { IGetNearByTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_nearby_turf_usecase_interface";
import { GetNearbyTurfsUseCase } from "../../application/turfs/get_nearby_turf_usecase";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { GetBookingsUseCase } from "../../application/Bookings/get_bookings_usecase";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { GetUpcomingBookingsUseCase } from "../../application/Bookings/get_upcoming_bookings_usecase.";
import { IGetBookedTurfUseCase } from "../../domain/useCaseInterfaces/Bookings/get_booked_useCase_interface";
import { GetBookedTurfDetails } from "../../application/Bookings/get_turf_details";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { GetPastBookingsUseCase } from "../../application/Bookings/get_past_bookings_usecase";

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
        container.register<IGetAllUsersUseCase>('IGetAllUsersUseCase',{
          useClass:GetAllUsersUseCase
        })
        container.register<IUpdateEntityStatusUseCase>('IUpdateEntityStatusUseCase',{
          useClass:UpdateEntityStatusUseCase
        })
        container.register<IAddTurfUseCase>('IAddTurfUseCase',{
          useClass:AddTurfUseCase
        })
        container.register<IValidateOwnerService>('IValidateOwnerService',{
          useClass:ValidateOwnerService
      })
      container.register<ICloudinarySignatureService>('ICloudinarySignatureService',{
        useClass:CloudinarySignatureService
      })
      container.register<IGetAllTurfsUseCase>('IGetAllTurfsUseCase',{
        useClass:GetAllTurfsUsecase
      })
      container.register<ITurfOwnerDetailsUseCase>('ITurfOwnerDetailsUseCase',{
        useClass:TurfOwnerDetailsUseCase
      })
      container.register<IUpdateTurfOwnerProfileUseCase>('IUpdateTurfOwnerProfileUseCase',{
        useClass:UpdateTurfOwnerProfileUseCase
      })
      container.register<IRetryAdminApprovalUseCase>('IRetryAdminApprovalUseCase',{
        useClass:RetryAdminApprovalUseCase
      })
      container.register<IGetMyTurfsUseCase>('IGetMyTurfsUseCase',{
        useClass:GetMyTurfsUseCase
      })
      container.register<IGetTurfByIdUseCase>('IGetTurfByIdUseCase',{
        useClass:GetTurfByIdUseCase
      })
      container.register<IUpdateTurfUseCase>('IUpdateTurfUseCase',{
        useClass:UpdateTurfUseCase
      })
      container.register<IUpdateTurfUseCase>('UpdateTurfUseCase',{
        useClass:UpdateTurfUseCase
      })
      container.register<ITurfService>('ITurfService',{
        useClass:TurfService
      })
      container.register<IRequestUpdateProfileUseCase>('IRequestUpdateProfileUseCase',{
        useClass:RequestUpdateProfileUseCase
      })
      container.register<IGenerateSlotUseCase>("IGenerateSlotUseCase",{
        useClass:GenerateSlotUseCase
      })
      container.register<ISlotService>("ISlotService",{
        useClass:SlotService
      })
      container.register<IGetSlotsUseCase>("IGetSlotsUseCase",{
        useClass:GetSlotsUseCase
      })
      container.register<IBookSlotUseCase>("IBookSlotUseCase",{
        useClass:BookSlotUseCase
      })
      container.register<IGetNearByTurfUseCase>("IGetNearByTurfUseCase",{
        useClass:GetNearbyTurfsUseCase
      })
      container.register<IGetBookingsUseCase>("IGetBookingsUseCase",{
        useClass:GetBookingsUseCase
      })
      container.register<IGetUpcomingBookingUseCase>('IGetUpcomingBookingUseCase',{
        useClass:GetUpcomingBookingsUseCase
      })
      container.register<IGetBookedTurfUseCase>('IGetBookedTurfUseCase',{
        useClass:GetBookedTurfDetails
      })
      container.register<IGetPastBookingsUseCase>('IGetPastBookingsUseCase',{
        useClass:GetPastBookingsUseCase
      })
  }
}
