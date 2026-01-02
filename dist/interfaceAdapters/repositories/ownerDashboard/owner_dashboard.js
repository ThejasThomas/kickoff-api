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
exports.OwnerDashboardRepository = void 0;
const tsyringe_1 = require("tsyringe");
const turf_model_1 = require("../../database/mongoDb/models/turf_model");
const booking_model_1 = require("../../database/mongoDb/models/booking_model");
const hosted_game_schema_1 = require("../../database/mongoDb/schemas/hosted_game_schema");
let OwnerDashboardRepository = class OwnerDashboardRepository {
    getOwnerTurfIds(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const turfs = yield turf_model_1.TurfModel.find({ ownerId }, { _id: 1, turfName: 1 }).lean();
            return {
                turfIds: turfs.map((t) => t._id.toString()),
                turfs,
            };
        });
    }
    getOwnerOverview(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            const result = yield booking_model_1.BookinModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        paymentStatus: "completed",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: "$price" },
                    },
                },
            ]);
            return {
                totalBookings: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalBookings) || 0,
                totalRevenue: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalRevenue) || 0,
            };
        });
    }
    getPerTurfStats(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds, turfs } = yield this.getOwnerTurfIds(ownerId);
            const stats = yield booking_model_1.BookinModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        paymentStatus: "completed",
                    },
                },
                {
                    $group: {
                        _id: "$turfId",
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: "$price" },
                    },
                },
            ]);
            return stats.map((item) => {
                const turf = turfs.find((t) => t._id.toString() === item._id);
                return {
                    turfId: item._id,
                    turfName: (turf === null || turf === void 0 ? void 0 : turf.turfName) || "Unknown",
                    totalBookings: item.totalBookings,
                    totalRevenue: item.totalRevenue,
                };
            });
        });
    }
    getDailyStats(ownerId, days) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return booking_model_1.BookinModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        paymentStatus: "completed",
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$createdAt",
                                },
                            },
                        },
                        bookings: { $sum: 1 },
                        revenue: { $sum: "$price" },
                    },
                },
                { $sort: { "_id.date": 1 } },
            ]).then((res) => res.map((r) => ({
                date: r._id.date,
                bookings: r.bookings,
                revenue: r.revenue,
            })));
        });
    }
    getMonthlyStats(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return booking_model_1.BookinModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        paymentStatus: "completed",
                    },
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $dateToString: {
                                    format: "%Y-%m",
                                    date: "$createdAt",
                                },
                            },
                        },
                        bookings: { $sum: 1 },
                        revenue: { $sum: "$price" },
                    },
                },
                { $sort: { "_id.month": 1 } },
            ]).then((res) => res.map((r) => ({
                month: r._id.month,
                bookings: r.bookings,
                revenue: r.revenue,
            })));
        });
    }
    getYearlyStats(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return booking_model_1.BookinModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        paymentStatus: "completed",
                    },
                },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        bookings: { $sum: 1 },
                        revenue: { $sum: "$price" },
                    },
                },
                { $sort: { "_id.year": 1 } },
            ]).then((res) => res.map((r) => ({
                year: r._id.year,
                bookings: r.bookings,
                revenue: r.revenue,
            })));
        });
    }
    getHostedGamesOverview(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            const result = yield hosted_game_schema_1.HostedGameModel.aggregate([
                { $match: { turfId: { $in: turfIds } } },
                {
                    $project: {
                        status: 1,
                        paidPlayers: {
                            $filter: {
                                input: "$players",
                                as: "player",
                                cond: { $eq: ["$$player.status", "paid"] },
                            },
                        },
                        pricePerPlayer: 1,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalGames: { $sum: 1 },
                        completedGames: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                            },
                        },
                        cancelledGames: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
                            },
                        },
                        totalPlayers: { $sum: { $size: "$paidPlayers" } },
                        totalRevenue: {
                            $sum: {
                                $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
                            },
                        },
                    },
                },
            ]);
            return {
                totalGames: ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalGames) || 0,
                completedGames: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.completedGames) || 0,
                cancelledGames: ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.cancelledGames) || 0,
                totalPlayers: ((_d = result[0]) === null || _d === void 0 ? void 0 : _d.totalPlayers) || 0,
                totalRevenue: ((_e = result[0]) === null || _e === void 0 ? void 0 : _e.totalRevenue) || 0,
            };
        });
    }
    getHostedGamesDailyStats(ownerId, days) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return hosted_game_schema_1.HostedGameModel.aggregate([
                {
                    $match: {
                        turfId: { $in: turfIds },
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
                        },
                    },
                },
                {
                    $project: {
                        createdAt: 1,
                        paidPlayers: {
                            $filter: {
                                input: "$players",
                                as: "player",
                                cond: { $eq: ["$$player.status", "paid"] },
                            },
                        },
                        pricePerPlayer: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$createdAt",
                                },
                            },
                        },
                        games: { $sum: 1 },
                        players: { $sum: { $size: "$paidPlayers" } },
                        revenue: {
                            $sum: {
                                $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
                            },
                        },
                    },
                },
                { $sort: { "_id.date": 1 } },
            ]).then((res) => res.map((r) => ({
                date: r._id.date,
                games: r.games,
                players: r.players,
                revenue: r.revenue,
            })));
        });
    }
    getHostedGamesMonthlyStats(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return hosted_game_schema_1.HostedGameModel.aggregate([
                { $match: { turfId: { $in: turfIds } } },
                {
                    $project: {
                        createdAt: 1,
                        paidPlayers: {
                            $filter: {
                                input: "$players",
                                as: "player",
                                cond: { $eq: ["$$player.status", "paid"] },
                            },
                        },
                        pricePerPlayer: 1,
                    },
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $dateToString: {
                                    format: "%Y-%m",
                                    date: "$createdAt",
                                },
                            },
                        },
                        games: { $sum: 1 },
                        players: { $sum: { $size: "$paidPlayers" } },
                        revenue: {
                            $sum: {
                                $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
                            },
                        },
                    },
                },
                { $sort: { "_id.month": 1 } },
            ]).then((res) => res.map((r) => ({
                month: r._id.month,
                games: r.games,
                players: r.players,
                revenue: r.revenue,
            })));
        });
    }
    getHostedGamesYearlyStats(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfIds } = yield this.getOwnerTurfIds(ownerId);
            return hosted_game_schema_1.HostedGameModel.aggregate([
                { $match: { turfId: { $in: turfIds } } },
                {
                    $project: {
                        createdAt: 1,
                        paidPlayers: {
                            $filter: {
                                input: "$players",
                                as: "player",
                                cond: { $eq: ["$$player.status", "paid"] },
                            },
                        },
                        pricePerPlayer: 1,
                    },
                },
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        games: { $sum: 1 },
                        players: { $sum: { $size: "$paidPlayers" } },
                        revenue: {
                            $sum: {
                                $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
                            },
                        },
                    },
                },
                { $sort: { "_id.year": 1 } },
            ]).then((res) => res.map((r) => ({
                year: r._id.year,
                games: r.games,
                players: r.players,
                revenue: r.revenue,
            })));
        });
    }
};
exports.OwnerDashboardRepository = OwnerDashboardRepository;
exports.OwnerDashboardRepository = OwnerDashboardRepository = __decorate([
    (0, tsyringe_1.injectable)()
], OwnerDashboardRepository);
