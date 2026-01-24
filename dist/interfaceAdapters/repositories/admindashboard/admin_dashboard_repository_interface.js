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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardRepository = void 0;
const booking_model_1 = require("../../database/mongoDb/models/booking_model");
const client_model_1 = require("../../database/mongoDb/models/client_model");
const turf_model_1 = require("../../database/mongoDb/models/turf_model");
const turfOwner_model_1 = require("../../database/mongoDb/models/turfOwner_model");
const admin_wallet_schema_1 = require("../../database/mongoDb/schemas/admin_wallet_schema");
const admin_wallet_transaction_schema_1 = require("../../database/mongoDb/schemas/admin_wallet_transaction_schema");
class AdminDashboardRepository {
    getUsersStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, active, blocked, pending] = yield Promise.all([
                client_model_1.ClientModel.countDocuments(),
                client_model_1.ClientModel.countDocuments({ status: "active" }),
                client_model_1.ClientModel.countDocuments({ status: "blocked" }),
                client_model_1.ClientModel.countDocuments({ status: "pending" }),
            ]);
            return { total, active, blocked, pending };
        });
    }
    getTurfStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, approved, pending, rejected] = yield Promise.all([
                turf_model_1.TurfModel.countDocuments(),
                turf_model_1.TurfModel.countDocuments({ status: "approved" }),
                turf_model_1.TurfModel.countDocuments({ status: "pending" }),
                turf_model_1.TurfModel.countDocuments({ status: "rejected" }),
            ]);
            return { total, approved, pending, rejected };
        });
    }
    getOwnerStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, active, blocked, pending] = yield Promise.all([
                turfOwner_model_1.TurfOwnerModel.countDocuments(),
                turfOwner_model_1.TurfOwnerModel.countDocuments({ status: "approved" }),
                turfOwner_model_1.TurfOwnerModel.countDocuments({ status: "blocked" }),
                turfOwner_model_1.TurfOwnerModel.countDocuments({ status: "pending" }),
            ]);
            return { total, active, blocked, pending };
        });
    }
    getBookingStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, completed, confirmed, cancelled] = yield Promise.all([
                booking_model_1.BookinModel.countDocuments(),
                booking_model_1.BookinModel.countDocuments({ status: "completed" }),
                booking_model_1.BookinModel.countDocuments({ status: "confirmed" }),
                booking_model_1.BookinModel.countDocuments({ status: "cancelled" }),
            ]);
            return { total, completed, confirmed, cancelled };
        });
    }
    getRevenueAnalytics(period) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const wallet = yield admin_wallet_schema_1.AdminWalletModel.findOne();
            const totalBalance = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.balance) !== null && _a !== void 0 ? _a : 0;
            const groupStage = this.getGroupStage(period);
            const revenue = yield admin_wallet_transaction_schema_1.AdminWalletTransactionModel.aggregate([
                { $match: { type: "CREDIT" } },
                {
                    $group: {
                        _id: groupStage,
                        amount: { $sum: "$amount" },
                    },
                },
                { $sort: { "_id.label": 1 } },
            ]);
            return {
                totalBalance,
                data: revenue.map((r) => ({
                    label: r._id.label,
                    amount: r.amount,
                })),
            };
        });
    }
    getGroupStage(period) {
        switch (period) {
            case "daily":
                return {
                    label: {
                        $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
                    },
                };
            case "weekly":
                return {
                    label: {
                        $concat: [
                            { $toString: { $isoWeekYear: "$transactionDate" } },
                            "-W",
                            { $toString: { $isoWeek: "$transactionDate" } },
                        ],
                    },
                };
            case "monthly":
                return {
                    label: {
                        $dateToString: { format: "%Y-%m", date: "$transactionDate" },
                    },
                };
            case "yearly":
                return {
                    label: {
                        $dateToString: { format: "%Y", date: "$transactionDate" },
                    },
                };
        }
    }
}
exports.AdminDashboardRepository = AdminDashboardRepository;
