"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseRegistry = void 0;
// src/frameworks/di/useCaseRegistry.ts
const tsyringe_1 = require("tsyringe");
const send_otp_email_useCase_1 = require("../../application/usecase/auth/send_otp_email_useCase");
const otp_service_1 = require("../../interfaceAdapters/services/otp_service");
const passsword_bcrypt_1 = require("../security/passsword_bcrypt");
const otp_bcrypt_1 = require("../security/otp_bcrypt");
const user_existence_service_1 = require("../../interfaceAdapters/services/user-existence_service");
const email_service_1 = require("../../interfaceAdapters/services/email_service");
const verify_otp_usecase_1 = require("../../application/usecase/auth/verify_otp_usecase");
const register_user_usecase_1 = require("../../application/usecase/auth/register_user_usecase");
const login_user_usecase_1 = require("../../application/usecase/auth/login_user_usecase");
const generate_token_usecase_1 = require("../../application/usecase/auth/generate_token_usecase");
const jwt_service_1 = require("../../interfaceAdapters/services/jwt_service");
const refresh_token_usecase_1 = require("../../application/usecase/auth/refresh_token_usecase");
const google_usecase_1 = require("../../application/usecase/auth/google_usecase");
const send_email_usecase_1 = require("../../application/usecase/common/send_email_usecase");
const forgotPassword_usecase_1 = require("../../application/usecase/auth/forgotPassword_usecase");
const resetpassword_usecase_1 = require("../../application/usecase/auth/resetpassword_usecase");
const validate_owner_service_1 = require("../../interfaceAdapters/services/validate_owner_service");
const cloudinary_service_1 = require("../../interfaceAdapters/services/cloudinary_service");
const get_all_turf_usecase_1 = require("../../application/usecase/turfs/get_all_turf_usecase");
const get_my_turf_usecase_1 = require("../../application/usecase/turfs/get_my_turf_usecase");
const get_turf_by_id_usecase_1 = require("../../application/usecase/turfs/get_turf_by_id_usecase");
const update_turf_by_id_usecase_1 = require("../../application/usecase/turfs/update_turf_by_id_usecase");
const turf_service_1 = require("../../interfaceAdapters/services/turf_service");
const generate_slots_usecase_1 = require("../../application/usecase/turfs/generate_slots_usecase");
const slot_service_1 = require("../../interfaceAdapters/services/slot_service");
const get_slot_usecase_1 = require("../../application/usecase/turfs/get_slot_usecase");
const get_nearby_turf_usecase_1 = require("../../application/usecase/turfs/get_nearby_turf_usecase");
const addRules_usecase_1 = require("../../application/usecase/turfs/addRules_usecase");
const rules_service_1 = require("../../interfaceAdapters/services/rules_service");
const getRules_usecase_1 = require("../../application/usecase/turfs/getRules_usecase");
const get_bookings_usecase_1 = require("../../application/usecase/Bookings/get_bookings_usecase");
const book_slot_usecase_1 = require("../../application/usecase/Bookings/book_slot_usecase");
const get_upcoming_bookings_usecase_1 = require("../../application/usecase/Bookings/get_upcoming_bookings_usecase.");
const get_turf_details_1 = require("../../application/usecase/Bookings/get_turf_details");
const get_past_bookings_usecase_1 = require("../../application/usecase/Bookings/get_past_bookings_usecase");
const get_bookedUsersDetails_1 = require("../../application/usecase/users/get_bookedUsersDetails");
const get_all_users_usecase_1 = require("../../application/usecase/users/get_all_users_usecase");
const update_entity_status_usecase_1 = require("../../application/usecase/users/update_entity_status_usecase");
const add_turf_usecase_1 = require("../../application/usecase/turfOwner/add_turf_usecase");
const get_turf_owner_profile_usecase_1 = require("../../application/usecase/turfOwner/get_turf_owner_profile_usecase");
const update_turf_owner_profile_usecase_1 = require("../../application/usecase/turfOwner/update_turf_owner_profile_usecase");
const retry_admin_approval_usecase_1 = require("../../application/usecase/turfOwner/retry_admin_approval_usecase");
const request_profile_update_usecase_1 = require("../../application/usecase/turfOwner/request_profile_update_usecase");
const get_user_details_usecase_1 = require("../../application/usecase/users/get_user_details_usecase");
const update_user_details_usecase_1 = require("../../application/usecase/users/update_user_details_usecase");
const addmoney_usecase_1 = require("../../application/usecase/wallet/addmoney_usecase");
const getWalletBalanceUseCase_1 = require("../../application/usecase/wallet/getWalletBalanceUseCase");
const getWalletHistory_usecase_1 = require("../../application/usecase/wallet/getWalletHistory_usecase");
const requestCancelBookingUsecase_1 = require("../../application/usecase/Bookings/requestCancelBookingUsecase");
const handle_owner_cance_request_usecase_1 = require("../../application/usecase/Bookings/handle_owner_cance_request_usecase");
const get_cancel_booking_requests_1 = require("../../application/usecase/Bookings/get_cancel_booking_requests");
const create_host_games_usecase_1 = require("../../application/usecase/Bookings/create_host_games_usecase");
const get_hostedGames_usecase_1 = require("../../application/usecase/Bookings/get_hostedGames_usecase");
const join_hosted_game_usecase_1 = require("../../application/usecase/Bookings/join_hosted_game_usecase");
const get_single_hosted_game_usecase_1 = require("../../application/usecase/Bookings/get_single_hosted_game_usecase");
const checkslotIsBookedUseCase_1 = require("../../application/usecase/turfs/checkslotIsBookedUseCase_");
const cance_slot_usecase_1 = require("../../application/usecase/turfs/cance_slot_usecase");
const offline_booking_usecase_1 = require("../../application/usecase/Bookings/offline_booking_usecase");
const create_chat_group_usecase_1 = require("../../application/usecase/users/create_chat_group_usecase");
const get_user_chat_group_usecase_1 = require("../../application/usecase/users/get_user_chat_group_usecase");
const saveChatMessage_usecase_1 = require("../../application/usecase/messages/saveChatMessage_usecase");
const getChatMessage_usecase_1 = require("../../application/usecase/messages/getChatMessage_usecase");
const getChatPageData_usecase_1 = require("../../application/usecase/messages/getChatPageData_usecase");
const addMoney_owner_wallet_usecase_1 = require("../../application/usecase/wallet/addMoney_owner_wallet_usecase");
const getowner_wallet_transaction_1 = require("../../application/usecase/wallet/getowner_wallet_transaction");
const owner_dashboard_usecase_1 = require("../../application/usecase/ownerDashboard/owner_dashboard_usecase");
const add_review_usecase_1 = require("../../application/usecase/review/add_review_usecase");
const getTurfReview_usecase_1 = require("../../application/usecase/review/getTurfReview_usecase");
const delete_review_usecase_1 = require("../../application/usecase/review/delete_review_usecase");
const get_owner_wallet_usecase_1 = require("../../application/usecase/wallet/get_owner_wallet_usecase");
const get_admin_wallet_usecase_1 = require("../../application/usecase/wallet/get_admin_wallet_usecase");
const get_admin_wallet_transaction_usecase_1 = require("../../application/usecase/wallet/get_admin_wallet_transaction_usecase");
const get_admin_dashboard_usecase_1 = require("../../application/usecase/admindashboard/get_admin_dashboard_usecase");
const ge_all_owners_wallet_transaction_usecase_1 = require("../../application/usecase/wallet/ge_all_owners_wallet_transaction_usecase");
const getAdminTransaction_details_usecase_1 = require("../../application/usecase/wallet/getAdminTransaction_details_usecase");
const hold_slot_usecase_1 = require("../../application/usecase/Bookings/hold_slot_usecase");
const add_rating_usecase_1 = require("../../application/usecase/rating/add_rating_usecase");
const get_turf_rating_usecase_1 = require("../../application/usecase/rating/get_turf_rating_usecase");
const delete_message_usecase_1 = require("../../application/usecase/messages/delete_message_usecase");
const get_upcoming_hosted_games_1 = require("../../application/usecase/Bookings/get_upcoming_hosted_games");
const cancel_hosted_game_usecase_1 = require("../../application/usecase/Bookings/cancel_hosted_game_usecase");
const release_slot_usecase_1 = require("../../application/usecase/Bookings/release_slot_usecase");
const phonenumber_existence_service_1 = require("../../interfaceAdapters/services/phonenumber_existence_service");
const stripe_1 = __importDefault(require("stripe"));
const StripeToken = "StripeInstance";
class UseCaseRegistry {
    static registerUseCases() {
        tsyringe_1.container.register("IOtpService", {
            useClass: otp_service_1.OtpService,
        });
        tsyringe_1.container.register("ISendOtpEmailUseCase", {
            useClass: send_otp_email_useCase_1.sendOtpEmailUseCase,
        });
        tsyringe_1.container.register("IPasswordBcrypt", {
            useClass: passsword_bcrypt_1.PasswordBcrypt,
        });
        tsyringe_1.container.register("IOtpBcrypt", {
            useClass: otp_bcrypt_1.OtpBcrypt,
        });
        tsyringe_1.container.register("IUserExistenceService", {
            useClass: user_existence_service_1.UserExistenceService,
        });
        tsyringe_1.container.register("IEmailService", {
            useClass: email_service_1.EmailService,
        });
        tsyringe_1.container.register("IVerifyOtpUseCase", {
            useClass: verify_otp_usecase_1.VerifyOtpUseCase,
        });
        tsyringe_1.container.register("IPhoneNumberExistenceService", {
            useClass: phonenumber_existence_service_1.PhoneNumberExistenceService,
        });
        tsyringe_1.container.register("IRegisterUserUseCase", {
            useClass: register_user_usecase_1.RegisterUserUseCase,
        });
        tsyringe_1.container.register("ILoginUserUseCase", {
            useClass: login_user_usecase_1.LoginUserUseCase,
        });
        tsyringe_1.container.register("IGenerateTokenUseCase", {
            useClass: generate_token_usecase_1.GenerateTokenUseCase,
        });
        tsyringe_1.container.register("ITokenService", {
            useClass: jwt_service_1.JWTService,
        });
        tsyringe_1.container.register("IRefreshTokenUseCase", {
            useClass: refresh_token_usecase_1.RefreshTokenUseCase,
        });
        tsyringe_1.container.register("IGoogleUseCase", {
            useClass: google_usecase_1.GoogleUseCase,
        });
        tsyringe_1.container.register("ISendEmailUseCase", {
            useClass: send_email_usecase_1.SendEmailUseCase,
        });
        tsyringe_1.container.register("IForgotPasswordUseCase", {
            useClass: forgotPassword_usecase_1.ForgotPasswordUseCase,
        });
        tsyringe_1.container.register("IResetPasswordUseCase", {
            useClass: resetpassword_usecase_1.ResetPasswordUseCase,
        });
        tsyringe_1.container.register("IGetAllUsersUseCase", {
            useClass: get_all_users_usecase_1.GetAllUsersUseCase,
        });
        tsyringe_1.container.register("IUpdateEntityStatusUseCase", {
            useClass: update_entity_status_usecase_1.UpdateEntityStatusUseCase,
        });
        tsyringe_1.container.register("IAddTurfUseCase", {
            useClass: add_turf_usecase_1.AddTurfUseCase,
        });
        tsyringe_1.container.register("IValidateOwnerService", {
            useClass: validate_owner_service_1.ValidateOwnerService,
        });
        tsyringe_1.container.register("ICloudinarySignatureService", {
            useClass: cloudinary_service_1.CloudinarySignatureService,
        });
        tsyringe_1.container.register("IGetAllTurfsUseCase", {
            useClass: get_all_turf_usecase_1.GetAllTurfsUsecase,
        });
        tsyringe_1.container.register("ITurfOwnerDetailsUseCase", {
            useClass: get_turf_owner_profile_usecase_1.TurfOwnerDetailsUseCase,
        });
        tsyringe_1.container.register("IUpdateTurfOwnerProfileUseCase", {
            useClass: update_turf_owner_profile_usecase_1.UpdateTurfOwnerProfileUseCase,
        });
        tsyringe_1.container.register("IRetryAdminApprovalUseCase", {
            useClass: retry_admin_approval_usecase_1.RetryAdminApprovalUseCase,
        });
        tsyringe_1.container.register("IGetMyTurfsUseCase", {
            useClass: get_my_turf_usecase_1.GetMyTurfsUseCase,
        });
        tsyringe_1.container.register("IGetTurfByIdUseCase", {
            useClass: get_turf_by_id_usecase_1.GetTurfByIdUseCase,
        });
        tsyringe_1.container.register("IUpdateTurfUseCase", {
            useClass: update_turf_by_id_usecase_1.UpdateTurfUseCase,
        });
        tsyringe_1.container.register("UpdateTurfUseCase", {
            useClass: update_turf_by_id_usecase_1.UpdateTurfUseCase,
        });
        tsyringe_1.container.register("ITurfService", {
            useClass: turf_service_1.TurfService,
        });
        tsyringe_1.container.register("IRequestUpdateProfileUseCase", {
            useClass: request_profile_update_usecase_1.RequestUpdateProfileUseCase,
        });
        tsyringe_1.container.register("IGenerateSlotUseCase", {
            useClass: generate_slots_usecase_1.GenerateSlotUseCase,
        });
        tsyringe_1.container.register("ISlotService", {
            useClass: slot_service_1.SlotService,
        });
        tsyringe_1.container.register("IGetSlotsUseCase", {
            useClass: get_slot_usecase_1.GetSlotsUseCase,
        });
        tsyringe_1.container.register("IBookSlotUseCase", {
            useClass: book_slot_usecase_1.BookSlotUseCase,
        });
        tsyringe_1.container.register("IGetNearByTurfUseCase", {
            useClass: get_nearby_turf_usecase_1.GetNearbyTurfsUseCase,
        });
        tsyringe_1.container.register("IGetBookingsUseCase", {
            useClass: get_bookings_usecase_1.GetBookingsUseCase,
        });
        tsyringe_1.container.register("IGetUpcomingBookingUseCase", {
            useClass: get_upcoming_bookings_usecase_1.GetUpcomingBookingsUseCase,
        });
        tsyringe_1.container.register("IGetBookedTurfUseCase", {
            useClass: get_turf_details_1.GetBookedTurfDetails,
        });
        tsyringe_1.container.register("IGetPastBookingsUseCase", {
            useClass: get_past_bookings_usecase_1.GetPastBookingsUseCase,
        });
        tsyringe_1.container.register("IAddRulesUseCase", {
            useClass: addRules_usecase_1.AddRulesUseCase,
        });
        tsyringe_1.container.register("IRuleService", {
            useClass: rules_service_1.RulesService,
        });
        tsyringe_1.container.register("IGetRulesUseCase", {
            useClass: getRules_usecase_1.GetRulesUseCase,
        });
        tsyringe_1.container.register("IGetBookedUsersDetails", {
            useClass: get_bookedUsersDetails_1.GetBookedUsersDetails,
        });
        tsyringe_1.container.register("IGetUserDetailsUseCase", {
            useClass: get_user_details_usecase_1.GetUserDetailsUseCase,
        });
        tsyringe_1.container.register("IUpdateUserDetailsUseCase", {
            useClass: update_user_details_usecase_1.UpdateUserDetailsUseCase,
        });
        tsyringe_1.container.register("IAddMoneyUseCase", {
            useClass: addmoney_usecase_1.AddMoneyUseCase,
        });
        tsyringe_1.container.register("IGetWalletBalanceUseCase", {
            useClass: getWalletBalanceUseCase_1.GetWalletBalanceUseCase,
        });
        tsyringe_1.container.register("IGetWalletHistoryUseCase", {
            useClass: getWalletHistory_usecase_1.GetWalletHistoryUseCase,
        });
        tsyringe_1.container.register("IRequestCancelBookingUseCase", {
            useClass: requestCancelBookingUsecase_1.RequestCancelBookingUseCase,
        });
        tsyringe_1.container.register("IHandlOwnerCancelRequestUseCase", {
            useClass: handle_owner_cance_request_usecase_1.HandleOwnerCancelrequestUseCase,
        });
        tsyringe_1.container.register("IGetCancelRequestsUseCase", {
            useClass: get_cancel_booking_requests_1.GetCancelBookingRequestsUsecase,
        });
        tsyringe_1.container.register("ICreateHostedGameUseCase", {
            useClass: create_host_games_usecase_1.createHostedGameUseCase,
        });
        tsyringe_1.container.register("IGetUpcomingHostedGamesUseCase", {
            useClass: get_hostedGames_usecase_1.GetUpcomingHostedGamesUseCase,
        });
        tsyringe_1.container.register("IJoinHostedGameUseCase", {
            useClass: join_hosted_game_usecase_1.JoinHostedGameUseCase,
        });
        tsyringe_1.container.register("IGetSingleHostedGameUseCase", {
            useClass: get_single_hosted_game_usecase_1.GetSingleHostedGameUseCase,
        });
        tsyringe_1.container.register("ICheckSlotIsBookedUseCase", {
            useClass: checkslotIsBookedUseCase_1.CheckSlotIsBooked,
        });
        tsyringe_1.container.register("ICancelSlotUseCase", {
            useClass: cance_slot_usecase_1.CancelSlotUseCase,
        });
        tsyringe_1.container.register("IOfflineBookingsUseCase", {
            useClass: offline_booking_usecase_1.OfflineBookingUseCase,
        });
        tsyringe_1.container.register("ICreateChatGroupUseCase", {
            useClass: create_chat_group_usecase_1.CreateChatGroupUseCase,
        });
        tsyringe_1.container.register("IGetUserChatGroupsUseCase", {
            useClass: get_user_chat_group_usecase_1.GetUserChatGroupUseCase,
        });
        tsyringe_1.container.register("ISaveChatMessageUseCase", {
            useClass: saveChatMessage_usecase_1.SaveChatMessageUseCase,
        });
        tsyringe_1.container.register("IGetChatMessageUseCase", {
            useClass: getChatMessage_usecase_1.GetChatMessagesUseCase,
        });
        tsyringe_1.container.register("IGetChatPageDataUseCase", {
            useClass: getChatPageData_usecase_1.GetChatPageDataUseCase,
        });
        tsyringe_1.container.register("IAddMoneyOwnerWalletUseCase", {
            useClass: addMoney_owner_wallet_usecase_1.AddMoneyOwnerWalletUseCase,
        });
        tsyringe_1.container.register("IGetOwnerWalletTransactionsUseCase", {
            useClass: getowner_wallet_transaction_1.GetOwnerWalletTransactionUseCase,
        });
        tsyringe_1.container.register("IGetOwnerDashboardUseCase", {
            useClass: owner_dashboard_usecase_1.GetOwnerDashboardUseCase,
        });
        tsyringe_1.container.register("IAddReviewUseCase", {
            useClass: add_review_usecase_1.AddReviewUseCase,
        });
        tsyringe_1.container.register("IGetTurfReviewsUseCase", {
            useClass: getTurfReview_usecase_1.GetTurfReviewsUseCase,
        });
        tsyringe_1.container.register("IDeleteReviewUseCase", {
            useClass: delete_review_usecase_1.DeleteReviewUseCase,
        });
        tsyringe_1.container.register("IGetOwnerWalletUseCase", {
            useClass: get_owner_wallet_usecase_1.GetOwnerWalletUseCase,
        });
        tsyringe_1.container.register("IGetAdminWalletUseCase", {
            useClass: get_admin_wallet_usecase_1.GetAdminWalletUseCase,
        });
        tsyringe_1.container.register("IAdminWalletTransactionUSeCase", {
            useClass: get_admin_wallet_transaction_usecase_1.GetAdminWalletTransactionUseCase,
        });
        tsyringe_1.container.register("IGetAdminDashboardUseCase", {
            useClass: get_admin_dashboard_usecase_1.GetAdminDashboardUseCase,
        });
        tsyringe_1.container.register("IGetAllOwnerWalletTransactionsUseCase", {
            useClass: ge_all_owners_wallet_transaction_usecase_1.GetAllOwnersWalletTransactionUseCase,
        });
        tsyringe_1.container.register("IGetTransactionDetailsUseCse", {
            useClass: getAdminTransaction_details_usecase_1.GetTrasactionDetailsUseCase,
        });
        tsyringe_1.container.register("IHoldSlotUseCase", {
            useClass: hold_slot_usecase_1.HoldSlotUseCase,
        });
        tsyringe_1.container.register("IAddRatingUseCase", {
            useClass: add_rating_usecase_1.AddRatingUseCase,
        });
        tsyringe_1.container.register("IGetTurfRatingsUseCase", {
            useClass: get_turf_rating_usecase_1.GetTurfRatingUseCase,
        });
        tsyringe_1.container.register("IDeleteChatMessageUseCase", {
            useClass: delete_message_usecase_1.DeleteChatMessageUseCase,
        });
        tsyringe_1.container.register("IGetUpcomingHostedGamesByUserUseCase", {
            useClass: get_upcoming_hosted_games_1.GetUpcomingHostedGameByUserUseCase,
        });
        tsyringe_1.container.register("Stripe", {
            useValue: new stripe_1.default(process.env.STRIPE_SECRET_KEY || ""),
        });
        tsyringe_1.container.register("IRequestHostedGameCancelUseCase", {
            useClass: cancel_hosted_game_usecase_1.RequestCancelHostedGameUseCase,
        });
        tsyringe_1.container.register("IReleaseSlotUsecase", {
            useClass: release_slot_usecase_1.ReleaseSlotUseCase,
        });
    }
}
exports.UseCaseRegistry = UseCaseRegistry;
