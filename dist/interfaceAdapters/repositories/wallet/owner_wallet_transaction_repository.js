"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.OwnerWalletTransactionRepository = void 0;
const mongoose_1 = require("mongoose");
const ownerWalletTransactionSchema_1 = require("../../database/mongoDb/schemas/ownerWalletTransactionSchema");
const tsyringe_1 = require("tsyringe");
const booking_model_1 = require("../../database/mongoDb/models/booking_model");
const turf_model_1 = require("../../database/mongoDb/models/turf_model");
const client_model_1 = require("../../database/mongoDb/models/client_model");
let OwnerWalletTransactionRepository = class OwnerWalletTransactionRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.create(data);
            return transaction.toObject();
        });
    }
    findByOwnerId(ownerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [transactions, totalResult] = yield Promise.all([
                ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.aggregate([
                    { $match: { ownerId } },
                    { $sort: { transactionDate: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "bookings",
                            localField: "bookingId",
                            foreignField: "_id",
                            as: "booking",
                        },
                    },
                    {
                        $unwind: {
                            path: "$booking",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "clients",
                            let: { userId: "$booking.userId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$userId", "$$userId"] },
                                    },
                                },
                                {
                                    $project: { fullName: 1, email: 1 },
                                },
                            ],
                            as: "client",
                        },
                    },
                    {
                        $unwind: {
                            path: "$client",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "turfs",
                            localField: "turfId",
                            foreignField: "_id",
                            as: "turf",
                        },
                    },
                    {
                        $unwind: {
                            path: "$turf",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            type: 1,
                            amount: 1,
                            transactionDate: 1,
                            turf: {
                                _id: "$turf._id",
                                turfName: "$turf.turfName",
                            },
                            booking: {
                                _id: "$booking._id",
                                user: {
                                    fullName: "$client.fullName",
                                    email: "$client.email",
                                },
                            },
                        },
                    },
                ]),
                ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.countDocuments({ ownerId }),
            ]);
            return {
                transactions,
                total: totalResult,
            };
        });
    }
    findByOwnerAndTurf(ownerId, turfId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.find({
                ownerId,
                turfId: new mongoose_1.Types.ObjectId(turfId),
            })
                .sort({ createdAt: -1 })
                .lean();
        });
    }
    getPaginated(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [transactions, total] = yield Promise.all([
                ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.find()
                    .populate("turfId", "turfName")
                    .populate("bookingId", "_id")
                    .sort({ transactionDate: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.countDocuments(),
            ]);
            return { transactions, total };
        });
    }
    getByTransactionId(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const transaction = yield ownerWalletTransactionSchema_1.OwnerWalletTransactionModel.findById(new mongoose_1.Types.ObjectId(transactionId)).lean();
            if (!transaction) {
                return null;
            }
            const booking = yield booking_model_1.BookinModel.findById(transaction.bookingId).lean();
            if (!booking)
                return null;
            const turf = yield turf_model_1.TurfModel.findById(transaction.turfId).lean();
            if (!turf)
                return null;
            const user = yield client_model_1.ClientModel.findOne({
                userId: booking.userId
            }).lean();
            return {
                transaction: {
                    id: transaction._id.toString(),
                    type: transaction.type,
                    amount: transaction.amount,
                    reason: transaction.reason,
                    status: transaction.status,
                    transactionDate: transaction.transactionDate
                },
                turf: {
                    id: turf._id.toString(),
                    turfName: turf.turfName,
                    city: (_a = turf.location) === null || _a === void 0 ? void 0 : _a.city,
                    state: (_b = turf.location) === null || _b === void 0 ? void 0 : _b.state,
                    ownerId: turf.ownerId,
                },
                booking: {
                    id: booking._id.toString(),
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    price: booking.price,
                },
                user: {
                    id: (user === null || user === void 0 ? void 0 : user._id.toString()) || "",
                    fullName: (user === null || user === void 0 ? void 0 : user.fullName) || "Unknown",
                    email: (user === null || user === void 0 ? void 0 : user.email) || "",
                },
            };
        });
    }
};
exports.OwnerWalletTransactionRepository = OwnerWalletTransactionRepository;
exports.OwnerWalletTransactionRepository = OwnerWalletTransactionRepository = __decorate([
    (0, tsyringe_1.injectable)()
], OwnerWalletTransactionRepository);
