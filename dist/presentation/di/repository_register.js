"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const otp_repository_1 = require("../../interfaceAdapters/repositories/auth/otp_repository");
const client_repository_1 = require("../../interfaceAdapters/repositories/users/client_repository");
const turfOwner_Repository_1 = require("../../interfaceAdapters/repositories/users/turfOwner_Repository");
const admin_repository_1 = require("../../interfaceAdapters/repositories/users/admin_repository");
const refresh_token_repositories_1 = require("../../interfaceAdapters/repositories/auth/refresh_token_repositories");
const slot_lock_repository_1 = require("../../interfaceAdapters/repositories/slotLock/slot_lock_repository");
const turf_repository_1 = require("../../interfaceAdapters/repositories/turf/turf_repository");
const slot_repository_1 = require("../../interfaceAdapters/repositories/turf/slot_repository");
const booking_repository_1 = require("../../interfaceAdapters/repositories/booking/booking_repository");
const rule_repository_1 = require("../../interfaceAdapters/repositories/turf/rule_repository");
const wallet_repository_1 = require("../../interfaceAdapters/repositories/wallet/wallet_repository");
const cancelRequestRepositoty_1 = require("../../interfaceAdapters/repositories/booking/cancelRequestRepositoty");
const host_game_repository_1 = require("../../interfaceAdapters/repositories/booking/host_game_repository");
const blockedSlot_repository_1 = require("../../interfaceAdapters/repositories/booking/blockedSlot_repository");
const chat_group_repository_1 = require("../../interfaceAdapters/repositories/chatgroup/chat_group_repository");
const chat_message_repository_1 = require("../../interfaceAdapters/repositories/chatgroup/chat_message_repository");
const owner_wallet_repository_1 = require("../../interfaceAdapters/repositories/wallet/owner_wallet_repository");
const owner_wallet_transaction_repository_1 = require("../../interfaceAdapters/repositories/wallet/owner_wallet_transaction_repository");
const owner_dashboard_1 = require("../../interfaceAdapters/repositories/ownerDashboard/owner_dashboard");
const review_repository_1 = require("../../interfaceAdapters/repositories/turf/review_repository");
const admin_wallet_repository_1 = require("../../interfaceAdapters/repositories/wallet/admin_wallet_repository");
const admin_wallet_transaction_repository_1 = require("../../interfaceAdapters/repositories/wallet/admin_wallet_transaction_repository");
const admin_dashboard_repository_interface_1 = require("../../interfaceAdapters/repositories/admindashboard/admin_dashboard_repository_interface");
const rating_repository_1 = require("../../interfaceAdapters/repositories/turf/rating_repository");
const passwordResetTokenRepository_1 = require("../../interfaceAdapters/repositories/passwordResetToken/passwordResetTokenRepository");
class RepositoryRegistry {
    static registerRepositories() {
        tsyringe_1.container.register("IOtpRepository", {
            useClass: otp_repository_1.OtpRepository,
        });
        tsyringe_1.container.register("IClientRepository", {
            useClass: client_repository_1.ClientRepository,
        });
        tsyringe_1.container.register("ITurfOwnerRepository", {
            useClass: turfOwner_Repository_1.TurfOwnerRepository,
        });
        tsyringe_1.container.register("IAdminRepository", {
            useClass: admin_repository_1.AdminRepository,
        });
        tsyringe_1.container.register("IRefreshTokenRepository", {
            useClass: refresh_token_repositories_1.RefreshTokenRepository,
        });
        tsyringe_1.container.register("ISlotLockRepository", {
            useClass: slot_lock_repository_1.SlotLockRepository,
        });
        tsyringe_1.container.register("IPasswordResetTokenRepository", {
            useClass: passwordResetTokenRepository_1.PasswordResetTokenRepository
        });
        tsyringe_1.container.register("ITurfRepository", {
            useClass: turf_repository_1.TurfRepository,
        });
        tsyringe_1.container.register("ISlotRepository", {
            useClass: slot_repository_1.SlotRepository,
        });
        tsyringe_1.container.register("IBookingRepository", {
            useClass: booking_repository_1.BookingRepository,
        });
        tsyringe_1.container.register("IRuleRepository", {
            useClass: rule_repository_1.RuleRepository,
        });
        tsyringe_1.container.register("IWalletRepository", {
            useClass: wallet_repository_1.WalletRepository,
        });
        tsyringe_1.container.register("ICancelRequestRepository", {
            useClass: cancelRequestRepositoty_1.CancelrequestRepository,
        });
        tsyringe_1.container.register("IHostedGameRepository", {
            useClass: host_game_repository_1.HostGameRepository,
        });
        tsyringe_1.container.register("IBlockedSlotRepository", {
            useClass: blockedSlot_repository_1.BlockedSlotRepository,
        });
        tsyringe_1.container.register("IChatGroupRepository", {
            useClass: chat_group_repository_1.ChatGroupRepository,
        });
        tsyringe_1.container.register("IChatMessageRepository", {
            useClass: chat_message_repository_1.ChatMessageRepository,
        });
        tsyringe_1.container.register("IOwnerWalletRepository", {
            useClass: owner_wallet_repository_1.OwnerWalletRepository,
        });
        tsyringe_1.container.register("IOwnerWalletTransactionRepository", {
            useClass: owner_wallet_transaction_repository_1.OwnerWalletTransactionRepository
        });
        tsyringe_1.container.register("IOwnerDashboardRepository", {
            useClass: owner_dashboard_1.OwnerDashboardRepository
        });
        tsyringe_1.container.register("IReviewRepository", {
            useClass: review_repository_1.ReviewRepository
        });
        tsyringe_1.container.register("IAdminWalletRepository", {
            useClass: admin_wallet_repository_1.AdminWalletRepository
        });
        tsyringe_1.container.register("IAdminWalletTransactionRepository", {
            useClass: admin_wallet_transaction_repository_1.AdminWalletTransactionRepository
        });
        tsyringe_1.container.register("IAdminDashboardRepository", {
            useClass: admin_dashboard_repository_interface_1.AdminDashboardRepository
        });
        tsyringe_1.container.register("IRatingRepository", {
            useClass: rating_repository_1.RatingRepository
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
