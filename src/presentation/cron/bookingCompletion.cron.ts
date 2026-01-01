import cron from "node-cron";
import { BookinModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { toDateTime } from "../../shared/utils/time";
import { HostedGameModel } from "../../interfaceAdapters/database/mongoDb/schemas/hosted_game_schema";
import { container } from "tsyringe";
import { IAdminWalletRepository } from "../../domain/repositoryInterface/wallet/admin_wallet_repository_interface";
import { IOwnerWalletRepository } from "../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { IAdminWalletTransactionRepository } from "../../domain/repositoryInterface/wallet/admin_wallet_transaction_history_interface";
import { IOwnerWalletTransactionRepository } from "../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { TurfModel } from "../../interfaceAdapters/database/mongoDb/models/turf_model";
import {
  OwnerWalletTransactionStatus,
  OwnerWalletTransactionType,
} from "../../domain/models/ownerWallet_transaction_entity";
import { Types } from "mongoose";

export const startBookingCompletionCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const adminWalletRepo = container.resolve<IAdminWalletRepository>(
        "IAdminWalletRepository"
      );
      const ownerWalletRepo = container.resolve<IOwnerWalletRepository>(
        "IOwnerWalletRepository"
      );
      const adminTransactionRepo =
        container.resolve<IAdminWalletTransactionRepository>(
          "IAdminWalletTransactionRepository"
        );
      const ownerTransactionRepo =
        container.resolve<IOwnerWalletTransactionRepository>(
          "IOwnerWalletTransactionRepository"
        );
      const bookings = await BookinModel.find({
        status: "confirmed",
        adminCommissionProcessed: false,
      });

      for (const booking of bookings) {
        const bookingEnd = toDateTime(booking.date, booking.endTime);

        if (bookingEnd <= now) {
          const turf = await TurfModel.findById(booking.turfId).select(
            "ownerId"
          );

          if (!turf) {
            console.error("❌ Turf not found for booking:", booking._id);
            continue;
          }
          const ownerId = turf.ownerId;

          const commission = Math.round(booking.price * 0.05);

          if (commission > 0) {
            await adminWalletRepo.incrementBalance(commission);

            await ownerWalletRepo.decrementBalance(ownerId, commission);

            await adminTransactionRepo.create({
              type: "CREDIT",
              amount: commission,
              ownerId,
              bookingId: booking.id.toString(),
              transactionDate: new Date(),
              description: "",
            });

            await ownerTransactionRepo.create({
              ownerId,
              turfId: new Types.ObjectId(booking.turfId),
              bookingId: booking.id,
              type: OwnerWalletTransactionType.DEBIT,
              amount: commission,
              reason: "Admin commission",
              status: OwnerWalletTransactionStatus.SUCCESS,
              transactionDate: new Date(),
            });
          }
          await BookinModel.updateOne(
            { _id: booking._id },
            { status: "completed", adminCommissionProcessed: true }
          );
        }
      }

      const hostedGames = await HostedGameModel.find({
        status: { $in: ["open", "full"] },
      });

      for (const game of hostedGames) {
        const gameEnd = toDateTime(game.slotDate, game.endTime);

        if (gameEnd <= now) {
          await HostedGameModel.updateOne(
            { _id: game._id },
            { status: "completed" }
          );
        }
      }
    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};
