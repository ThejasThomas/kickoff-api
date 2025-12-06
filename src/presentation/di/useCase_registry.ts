// src/frameworks/di/useCaseRegistry.ts
import { container } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../domain/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { sendOtpEmailUseCase } from "../../application/usecase/auth/send_otp_email_useCase";

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
import { VerifyOtpUseCase } from "../../application/usecase/auth/verify_otp_usecase";
import { IRegisterUserUseCase } from "../../domain/useCaseInterfaces/auth/register_usecase_interface";
import { RegisterUserUseCase } from "../../application/usecase/auth/register_user_usecase";
import { ILoginUserUseCase } from "../../domain/useCaseInterfaces/auth/login_usecase_interface";
import { LoginUserUseCase } from "../../application/usecase/auth/login_user_usecase";
import { IGenerateTokenUseCase } from "../../domain/useCaseInterfaces/auth/generate_token_usecase_interface";
import { GenerateTokenUseCase } from "../../application/usecase/auth/generate_token_usecase";
import { ITokenService } from "../../domain/serviceInterfaces/token_service_interface";
import { JWTService } from "../../interfaceAdapters/services/jwt_service";
import { IRefreshTokenUseCase } from "../../domain/useCaseInterfaces/auth/refresh_token_usecase_interface";
import { RefreshTokenUseCase } from "../../application/usecase/auth/refresh_token_usecase";
import { IGoogleUseCase } from "../../domain/useCaseInterfaces/auth/google_usecase";
import { GoogleUseCase } from "../../application/usecase/auth/google_usecase";
import { ISendEmailUseCase } from "../../domain/useCaseInterfaces/common/send_email_usecase_interface";
import { SendEmailUseCase } from "../../application/usecase/common/send_email_usecase";
import { IForgotPasswordUseCase } from "../../domain/useCaseInterfaces/auth/forgot_password_usecase_interface";
import { ForgotPasswordUseCase } from "../../application/usecase/auth/forgotPassword_usecase";
import { IResetPasswordUseCase } from "../../domain/useCaseInterfaces/auth/reset_password_usecase_interface";
import { ResetPasswordUseCase } from "../../application/usecase/auth/resetpassword_usecase";
import { IGetAllUsersUseCase } from "../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { IAddTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { IValidateOwnerService } from "../../domain/serviceInterfaces/validate_owner_service_interface";
import { ValidateOwnerService } from "../../interfaceAdapters/services/validate_owner_service";
import { ICloudinarySignatureService } from "../../domain/serviceInterfaces/cloudinary_service_interface";
import { CloudinarySignatureService } from "../../interfaceAdapters/services/cloudinary_service";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_all_turfs_usecase_interface";
import { GetAllTurfsUsecase } from "../../application/usecase/turfs/get_all_turf_usecase";
import { ITurfOwnerDetailsUseCase } from "../../domain/useCaseInterfaces/turfOwner/get_turf_owner_profile_usecase";
import { IUpdateTurfOwnerProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/update_turf_owner_profile_usecase";
import { IRetryAdminApprovalUseCase } from "../../domain/useCaseInterfaces/turfOwner/retry_admin_approval_usecase_interface";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_my_turf_usecase_interface";
import { GetMyTurfsUseCase } from "../../application/usecase/turfs/get_my_turf_usecase";
import { IGetTurfByIdUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_turf_by_id_usecase_interface";
import { GetTurfByIdUseCase } from "../../application/usecase/turfs/get_turf_by_id_usecase";
import { IUpdateTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/update_turf_by_id_usecase_interface";
import { UpdateTurfUseCase } from "../../application/usecase/turfs/update_turf_by_id_usecase";
import { ITurfService } from "../../domain/serviceInterfaces/turfService_interface";
import { TurfService } from "../../interfaceAdapters/services/turf_service";
import { IRequestUpdateProfileUseCase } from "../../domain/useCaseInterfaces/turfOwner/request_profile_update_usecase";
import { IGenerateSlotUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/generateSlotsUseCase";
import { GenerateSlotUseCase } from "../../application/usecase/turfs/generate_slots_usecase";
import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { SlotService } from "../../interfaceAdapters/services/slot_service";
import { IGetSlotsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_slots_usecase";
import { GetSlotsUseCase } from "../../application/usecase/turfs/get_slot_usecase";
import { IBookSlotUseCase } from "../../domain/useCaseInterfaces/Bookings/book_slot_useCase_interface";
import { IGetNearByTurfUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_nearby_turf_usecase_interface";
import { GetNearbyTurfsUseCase } from "../../application/usecase/turfs/get_nearby_turf_usecase";
import { IGetBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_bookings_useCase_interface";
import { IGetUpcomingBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/get_upcoming_bookings_usecase_interface";
import { IGetBookedTurfUseCase } from "../../domain/useCaseInterfaces/Bookings/get_booked_useCase_interface";
import { IGetPastBookingsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_pastbookings_usecase_interface";
import { IAddRulesUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/add_rules_useCase_interface";
import { AddRulesUseCase } from "../../application/usecase/turfs/addRules_usecase";
import { IRuleService } from "../../domain/serviceInterfaces/rules_service_interface";
import { RulesService } from "../../interfaceAdapters/services/rules_service";
import { IGetRulesUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_rules_useCase_interface";
import { GetRulesUseCase } from "../../application/usecase/turfs/getRules_usecase";
import { IGetBookedUsersDetails } from "../../domain/useCaseInterfaces/users/get_bookedUsersDetails_interface";
import { GetBookingsUseCase } from "../../application/usecase/Bookings/get_bookings_usecase";
import { BookSlotUseCase } from "../../application/usecase/Bookings/book_slot_usecase";
import { GetUpcomingBookingsUseCase } from "../../application/usecase/Bookings/get_upcoming_bookings_usecase.";
import { GetBookedTurfDetails } from "../../application/usecase/Bookings/get_turf_details";
import { GetPastBookingsUseCase } from "../../application/usecase/Bookings/get_past_bookings_usecase";
import { GetBookedUsersDetails } from "../../application/usecase/users/get_bookedUsersDetails";
import { GetAllUsersUseCase } from "../../application/usecase/users/get_all_users_usecase";
import { UpdateEntityStatusUseCase } from "../../application/usecase/users/update_entity_status_usecase";
import { AddTurfUseCase } from "../../application/usecase/turfOwner/add_turf_usecase";
import { TurfOwnerDetailsUseCase } from "../../application/usecase/turfOwner/get_turf_owner_profile_usecase";
import { UpdateTurfOwnerProfileUseCase } from "../../application/usecase/turfOwner/update_turf_owner_profile_usecase";
import { RetryAdminApprovalUseCase } from "../../application/usecase/turfOwner/retry_admin_approval_usecase";
import { RequestUpdateProfileUseCase } from "../../application/usecase/turfOwner/request_profile_update_usecase";
import { IGetUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/get_user_details_usecase_interface";
import { GetUserDetailsUseCase } from "../../application/usecase/users/get_user_details_usecase";
import { IUpdateUserDetailsUseCase } from "../../domain/useCaseInterfaces/users/update_userdetails_usecase_interface";
import { UpdateUserDetailsUseCase } from "../../application/usecase/users/update_user_details_usecase";
import { IAddMoneyUseCase } from "../../domain/useCaseInterfaces/wallet/add_money_usecase_interface";
import { AddMoneyUseCase } from "../../application/usecase/wallet/addmoney_usecase";
import { GetWalletBalanceUseCase } from "../../application/usecase/wallet/getWalletBalanceUseCase";
import { IGetWalletBalanceUseCase } from "../../domain/useCaseInterfaces/wallet/getWalletBalanceUseCase_interface";
import { IGetWalletHistoryUseCase } from "../../domain/useCaseInterfaces/wallet/get_walletHistory_usecase";
import { GetWalletHistoryUseCase } from "../../application/usecase/wallet/getWalletHistory_usecase";
import { IRequestCancelBookingUseCase } from "../../domain/useCaseInterfaces/Bookings/cancel_booking_usecase";
import { RequestCancelBookingUseCase } from "../../application/usecase/Bookings/requestCancelBookingUsecase";
import { IHandlOwnerCancelRequestUseCase } from "../../domain/useCaseInterfaces/Bookings/handle_owner_cancel_request_usecase_interface";
import { HandleOwnerCancelrequestUseCase } from "../../application/usecase/Bookings/handle_owner_cance_request_usecase";
import { IGetCancelRequestsUseCase } from "../../domain/useCaseInterfaces/Bookings/get_cancel_booking_requests_interface";
import { GetCancelBookingRequestsUsecase } from "../../application/usecase/Bookings/get_cancel_booking_requests";

export class UseCaseRegistry {
  static registerUseCases(): void {
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
      useClass: sendOtpEmailUseCase,
    });

    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });

    container.register<IBcrypt>("IOtpBcrypt", {
      useClass: OtpBcrypt,
    });

    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });
    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });
    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });

    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });
    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });
    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });
    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });
    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });
    container.register<IGoogleUseCase>("IGoogleUseCase", {
      useClass: GoogleUseCase,
    });
    container.register<ISendEmailUseCase>("ISendEmailUseCase", {
      useClass: SendEmailUseCase,
    });
    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
      useClass: ForgotPasswordUseCase,
    });
    container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
      useClass: ResetPasswordUseCase,
    });
    container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
      useClass: GetAllUsersUseCase,
    });
    container.register<IUpdateEntityStatusUseCase>(
      "IUpdateEntityStatusUseCase",
      {
        useClass: UpdateEntityStatusUseCase,
      }
    );
    container.register<IAddTurfUseCase>("IAddTurfUseCase", {
      useClass: AddTurfUseCase,
    });
    container.register<IValidateOwnerService>("IValidateOwnerService", {
      useClass: ValidateOwnerService,
    });
    container.register<ICloudinarySignatureService>(
      "ICloudinarySignatureService",
      {
        useClass: CloudinarySignatureService,
      }
    );
    container.register<IGetAllTurfsUseCase>("IGetAllTurfsUseCase", {
      useClass: GetAllTurfsUsecase,
    });
    container.register<ITurfOwnerDetailsUseCase>("ITurfOwnerDetailsUseCase", {
      useClass: TurfOwnerDetailsUseCase,
    });
    container.register<IUpdateTurfOwnerProfileUseCase>(
      "IUpdateTurfOwnerProfileUseCase",
      {
        useClass: UpdateTurfOwnerProfileUseCase,
      }
    );
    container.register<IRetryAdminApprovalUseCase>(
      "IRetryAdminApprovalUseCase",
      {
        useClass: RetryAdminApprovalUseCase,
      }
    );
    container.register<IGetMyTurfsUseCase>("IGetMyTurfsUseCase", {
      useClass: GetMyTurfsUseCase,
    });
    container.register<IGetTurfByIdUseCase>("IGetTurfByIdUseCase", {
      useClass: GetTurfByIdUseCase,
    });
    container.register<IUpdateTurfUseCase>("IUpdateTurfUseCase", {
      useClass: UpdateTurfUseCase,
    });
    container.register<IUpdateTurfUseCase>("UpdateTurfUseCase", {
      useClass: UpdateTurfUseCase,
    });
    container.register<ITurfService>("ITurfService", {
      useClass: TurfService,
    });
    container.register<IRequestUpdateProfileUseCase>(
      "IRequestUpdateProfileUseCase",
      {
        useClass: RequestUpdateProfileUseCase,
      }
    );
    container.register<IGenerateSlotUseCase>("IGenerateSlotUseCase", {
      useClass: GenerateSlotUseCase,
    });
    container.register<ISlotService>("ISlotService", {
      useClass: SlotService,
    });
    container.register<IGetSlotsUseCase>("IGetSlotsUseCase", {
      useClass: GetSlotsUseCase,
    });
    container.register<IBookSlotUseCase>("IBookSlotUseCase", {
      useClass: BookSlotUseCase,
    });
    container.register<IGetNearByTurfUseCase>("IGetNearByTurfUseCase", {
      useClass: GetNearbyTurfsUseCase,
    });
    container.register<IGetBookingsUseCase>("IGetBookingsUseCase", {
      useClass: GetBookingsUseCase,
    });
    container.register<IGetUpcomingBookingUseCase>(
      "IGetUpcomingBookingUseCase",
      {
        useClass: GetUpcomingBookingsUseCase,
      }
    );
    container.register<IGetBookedTurfUseCase>("IGetBookedTurfUseCase", {
      useClass: GetBookedTurfDetails,
    });
    container.register<IGetPastBookingsUseCase>("IGetPastBookingsUseCase", {
      useClass: GetPastBookingsUseCase,
    });
    container.register<IAddRulesUseCase>("IAddRulesUseCase", {
      useClass: AddRulesUseCase,
    });
    container.register<IRuleService>("IRuleService", {
      useClass: RulesService,
    });
    container.register<IGetRulesUseCase>("IGetRulesUseCase", {
      useClass: GetRulesUseCase,
    });
    container.register<IGetBookedUsersDetails>("IGetBookedUsersDetails", {
      useClass: GetBookedUsersDetails,
    });
    container.register<IGetUserDetailsUseCase>("IGetUserDetailsUseCase", {
      useClass:GetUserDetailsUseCase
    })
    container.register<IUpdateUserDetailsUseCase>("IUpdateUserDetailsUseCase",{
      useClass:UpdateUserDetailsUseCase
    })
    container.register<IAddMoneyUseCase>("IAddMoneyUseCase",{
      useClass:AddMoneyUseCase
    })
    container.register<IGetWalletBalanceUseCase>("IGetWalletBalanceUseCase",{
      useClass:GetWalletBalanceUseCase
    })
    container.register<IGetWalletHistoryUseCase>("IGetWalletHistoryUseCase",{
      useClass:GetWalletHistoryUseCase
    })
    container.register<IRequestCancelBookingUseCase>("IRequestCancelBookingUseCase",{
      useClass:RequestCancelBookingUseCase
    })
    container.register<IHandlOwnerCancelRequestUseCase>("IHandlOwnerCancelRequestUseCase",{
      useClass:HandleOwnerCancelrequestUseCase
    })
    container.register<IGetCancelRequestsUseCase>("IGetCancelRequestsUseCase",{
      useClass:GetCancelBookingRequestsUsecase
    })
  }
}
