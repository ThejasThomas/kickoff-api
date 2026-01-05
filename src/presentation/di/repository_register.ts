import { container } from "tsyringe";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp_repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client_repository";
import { TurfOwnerRepository } from "../../interfaceAdapters/repositories/users/turfOwner_Repository";
import { IAdminRepository } from "../../domain/repositoryInterface/users/admin-repository.interface.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin_repository";
import { IRefreshTokenRepository } from "../../domain/repositoryInterface/auth/refresh-token-repository.interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh_token_repositories";
import {  SlotLockRepository } from "../../interfaceAdapters/repositories/slotLock/slot_lock_repository";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { TurfRepository } from "../../interfaceAdapters/repositories/turf/turf_repository";
import { ISlotRepository } from "../../domain/repositoryInterface/Turf/slot_repository_interface";
import { SlotRepository } from "../../interfaceAdapters/repositories/turf/slot_repository";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";
import { BookingRepository } from "../../interfaceAdapters/repositories/booking/booking_repository";
import { IRuleRepository } from "../../domain/repositoryInterface/Turf/rule_repository_interface";
import { RuleRepository } from "../../interfaceAdapters/repositories/turf/rule_repository";
import { IWalletRepository } from "../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { WalletRepository } from "../../interfaceAdapters/repositories/wallet/wallet_repository";
import { ICancelRequestRepository } from "../../domain/repositoryInterface/booking/cancel_request_repository";
import { CancelrequestRepository } from "../../interfaceAdapters/repositories/booking/cancelRequestRepositoty";
import { IHostedGameRepository } from "../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { HostGameRepository } from "../../interfaceAdapters/repositories/booking/host_game_repository";
import { IBlockedSlotRepository } from "../../domain/repositoryInterface/Turf/blocked_slot_repository_interface";
import { BlockedSlotRepository } from "../../interfaceAdapters/repositories/booking/blockedSlot_repository";
import { IChatGroupRepository } from "../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";
import { ChatGroupRepository } from "../../interfaceAdapters/repositories/chatgroup/chat_group_repository";
import { IChatMessageRepository } from "../../domain/repositoryInterface/chatgroup/chat_message_repository_interface";
import { ChatMessageRepository } from "../../interfaceAdapters/repositories/chatgroup/chat_message_repository";
import { IOwnerWalletRepository } from "../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { OwnerWalletRepository } from "../../interfaceAdapters/repositories/wallet/owner_wallet_repository";
import { IOwnerWalletTransactionRepository } from "../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { OwnerWalletTransactionRepository } from "../../interfaceAdapters/repositories/wallet/owner_wallet_transaction_repository";
import { IOwnerDashboardRepository } from "../../domain/repositoryInterface/ownerDashboard/owner_dashboard_repository_interface";
import { OwnerDashboardRepository } from "../../interfaceAdapters/repositories/ownerDashboard/owner_dashboard";
import { IReviewRepository } from "../../domain/repositoryInterface/Turf/review_repository_interface";
import { ReviewRepository } from "../../interfaceAdapters/repositories/turf/review_repository";
import { IAdminWalletRepository } from "../../domain/repositoryInterface/wallet/admin_wallet_repository_interface";
import { AdminWalletRepository } from "../../interfaceAdapters/repositories/wallet/admin_wallet_repository";
import { IAdminWalletTransactionRepository } from "../../domain/repositoryInterface/wallet/admin_wallet_transaction_history_interface";
import { AdminWalletTransactionRepository } from "../../interfaceAdapters/repositories/wallet/admin_wallet_transaction_repository";
import { IAdminDashboardRepository } from "../../domain/repositoryInterface/admindashboard/admin_dashboard_repository_interface";
import { AdminDashboardRepository } from "../../interfaceAdapters/repositories/admindashboard/admin_dashboard_repository_interface";
import { IRatingRepository } from "../../domain/repositoryInterface/Turf/rating_repository_interface";
import { RatingRepository } from "../../interfaceAdapters/repositories/turf/rating_repository";
import { ISlotLockRepository } from "../../domain/repositoryInterface/slotLock/slot_lock_repository_interface";
import { IPasswordResetTokenRepository } from "../../domain/repositoryInterface/passwordResetToken/password_reset_token_repository";
import { PasswordResetTokenRepository } from "../../interfaceAdapters/repositories/passwordResetToken/passwordResetTokenRepository";
export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register("IOtpRepository", {
      useClass: OtpRepository,
    });

    container.register("IClientRepository", {
      useClass: ClientRepository,
    });
    container.register("ITurfOwnerRepository", {
      useClass: TurfOwnerRepository,
    });

    container.register<IAdminRepository>("IAdminRepository", {
      useClass: AdminRepository,
    });
    container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
      useClass: RefreshTokenRepository,
    });
    container.register<ISlotLockRepository>("ISlotLockRepository", {
      useClass: SlotLockRepository,
    });
    container.register<IPasswordResetTokenRepository>("IPasswordResetTokenRepository",{
      useClass:PasswordResetTokenRepository
    });
    container.register<ITurfRepository>("ITurfRepository", {
      useClass: TurfRepository,
    });
    container.register<ISlotRepository>("ISlotRepository", {
      useClass: SlotRepository,
    });
    container.register<IBookingRepository>("IBookingRepository", {
      useClass: BookingRepository,
    });
    container.register<IRuleRepository>("IRuleRepository", {
      useClass: RuleRepository,
    });

    container.register<IWalletRepository>("IWalletRepository", {
      useClass: WalletRepository,
    });
    container.register<ICancelRequestRepository>("ICancelRequestRepository", {
      useClass: CancelrequestRepository,
    });
    container.register<IHostedGameRepository>("IHostedGameRepository", {
      useClass: HostGameRepository,
    });

    container.register<IBlockedSlotRepository>("IBlockedSlotRepository", {
      useClass: BlockedSlotRepository,
    });
    container.register<IChatGroupRepository>("IChatGroupRepository", {
      useClass: ChatGroupRepository,
    });
    container.register<IChatMessageRepository>("IChatMessageRepository", {
      useClass: ChatMessageRepository,
    });
    container.register<IOwnerWalletRepository>("IOwnerWalletRepository", {
      useClass: OwnerWalletRepository,
    });
    container.register<IOwnerWalletTransactionRepository>("IOwnerWalletTransactionRepository",{
      useClass:OwnerWalletTransactionRepository
    })
    container.register<IOwnerDashboardRepository>("IOwnerDashboardRepository",{
      useClass:OwnerDashboardRepository
    })
    container.register<IReviewRepository>("IReviewRepository",{
      useClass:ReviewRepository
    })
    container.register<IAdminWalletRepository>("IAdminWalletRepository",{
      useClass:AdminWalletRepository
    })
    container.register<IAdminWalletTransactionRepository>("IAdminWalletTransactionRepository",{
      useClass:AdminWalletTransactionRepository
    })
    container.register<IAdminDashboardRepository>("IAdminDashboardRepository",{
      useClass:AdminDashboardRepository
    })
    container.register<IRatingRepository>("IRatingRepository",{
      useClass:RatingRepository
    })
  }
}
