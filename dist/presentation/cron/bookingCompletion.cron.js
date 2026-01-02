"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBookingCompletionCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const booking_model_1 = require("../../interfaceAdapters/database/mongoDb/models/booking_model");
const time_1 = require("../../shared/utils/time");
const hosted_game_schema_1 = require("../../interfaceAdapters/database/mongoDb/schemas/hosted_game_schema");
const tsyringe_1 = require("tsyringe");
const turf_model_1 = require("../../interfaceAdapters/database/mongoDb/models/turf_model");
const ownerWallet_transaction_entity_1 = require("../../domain/models/ownerWallet_transaction_entity");
const mongoose_1 = require("mongoose");
const startBookingCompletionCron = () => {
    node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const adminWalletRepo = tsyringe_1.container.resolve("IAdminWalletRepository");
            const ownerWalletRepo = tsyringe_1.container.resolve("IOwnerWalletRepository");
            const adminTransactionRepo = tsyringe_1.container.resolve("IAdminWalletTransactionRepository");
            const ownerTransactionRepo = tsyringe_1.container.resolve("IOwnerWalletTransactionRepository");
            const bookings = yield booking_model_1.BookinModel.find({
                status: "confirmed",
                adminCommissionProcessed: false,
            });
            for (const booking of bookings) {
                const bookingEnd = (0, time_1.toDateTime)(booking.date, booking.endTime);
                if (bookingEnd <= now) {
                    const turf = yield turf_model_1.TurfModel.findById(booking.turfId).select("ownerId");
                    if (!turf) {
                        console.error("❌ Turf not found for booking:", booking._id);
                        continue;
                    }
                    const ownerId = turf.ownerId;
                    const commission = Math.round(booking.price * 0.05);
                    if (commission > 0) {
                        yield adminWalletRepo.incrementBalance(commission);
                        yield ownerWalletRepo.decrementBalance(ownerId, commission);
                        yield adminTransactionRepo.create({
                            type: "CREDIT",
                            amount: commission,
                            ownerId,
                            bookingId: booking.id.toString(),
                            transactionDate: new Date(),
                            description: "",
                        });
                        yield ownerTransactionRepo.create({
                            ownerId,
                            turfId: new mongoose_1.Types.ObjectId(booking.turfId),
                            bookingId: booking.id,
                            type: ownerWallet_transaction_entity_1.OwnerWalletTransactionType.DEBIT,
                            amount: commission,
                            reason: "Admin commission",
                            status: ownerWallet_transaction_entity_1.OwnerWalletTransactionStatus.SUCCESS,
                            transactionDate: new Date(),
                        });
                    }
                    yield booking_model_1.BookinModel.updateOne({ _id: booking._id }, { status: "completed", adminCommissionProcessed: true });
                }
            }
            const hostedGames = yield hosted_game_schema_1.HostedGameModel.find({
                status: { $in: ["open", "full"] },
            });
            for (const game of hostedGames) {
                const gameEnd = (0, time_1.toDateTime)(game.slotDate, game.endTime);
                if (gameEnd <= now) {
                    yield hosted_game_schema_1.HostedGameModel.updateOne({ _id: game._id }, { status: "completed" });
                }
            }
        }
        catch (err) {
            console.error("❌ Cron error:", err);
        }
    }));
};
exports.startBookingCompletionCron = startBookingCompletionCron;
