"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.HostGameRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const hosted_game_schema_1 = require("../../database/mongoDb/schemas/hosted_game_schema");
const turf_model_1 = require("../../database/mongoDb/models/turf_model");
const client_model_1 = require("../../database/mongoDb/models/client_model");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const cancellationrequest_model_1 = require("../../database/mongoDb/models/cancellationrequest_model");
let HostGameRepository = class HostGameRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(hosted_game_schema_1.HostedGameModel);
    }
    createGame(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hosted_game_schema_1.HostedGameModel.create(data);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hosted_game_schema_1.HostedGameModel.findById(id);
        });
    }
    findbyTurfIdAndDate(turfId, slotDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return hosted_game_schema_1.HostedGameModel.find({
                turfId,
                slotDate,
                status: { $in: ["open", "full"] },
            });
        });
    }
    getUpComingGames(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search, minPrice, maxPrice } = params;
                const today = new Date();
                console.log("today", today);
                const todayStr = today.toISOString().split("T")[0];
                const nowTime = today.toTimeString().slice(0, 5);
                console.log("todayyystr", todayStr);
                console.log("nowwTime", nowTime);
                const now = new Date();
                let turfIds = [];
                if (search) {
                    const turfs = yield turf_model_1.TurfModel.find({
                        $or: [
                            { turfName: { $regex: search, $options: "i" } },
                            { "location.address": { $regex: search, $options: "i" } },
                            { "location.city": { $regex: search, $options: "i" } },
                            { "location.state": { $regex: search, $options: "i" } },
                        ],
                    }).select("_id");
                    turfIds = turfs.map((t) => t._id);
                    if (turfIds.length === 0)
                        return [];
                }
                const gameFilter = {
                    status: { $in: ["open", "full"] },
                    gameStartAt: { $gt: now },
                };
                if (turfIds.length) {
                    gameFilter.turfId = { $in: turfIds };
                }
                if (minPrice || maxPrice) {
                    gameFilter.pricePerPlayer = Object.assign(Object.assign({}, (minPrice && { $gte: minPrice })), (maxPrice && { $lte: maxPrice }));
                }
                const skip = (page - 1) * limit;
                const games = yield hosted_game_schema_1.HostedGameModel.find(gameFilter)
                    .sort({ gameStartAt: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean();
                if (!games.length)
                    return [];
                const result = [];
                console.log("resultttt", result);
                for (const game of games) {
                    const turf = yield turf_model_1.TurfModel.findById(game.turfId).lean();
                    const hostUser = yield client_model_1.ClientModel.findOne({
                        userId: game.hostUserId,
                    }).lean();
                    const playersWithUser = [];
                    for (const player of game.players || []) {
                        const playerUser = yield client_model_1.ClientModel.findOne({
                            userId: player.userId,
                        }).lean();
                        playersWithUser.push({
                            userId: player.userId,
                            status: player.status,
                            joinedAt: player.joinedAt
                                ? new Date(player.joinedAt).toISOString()
                                : undefined,
                            user: playerUser
                                ? {
                                    name: playerUser.fullName,
                                    email: playerUser.email,
                                    phoneNumber: playerUser.phoneNumber,
                                }
                                : null,
                        });
                    }
                    result.push({
                        _id: game._id.toString(),
                        hostUserId: game.hostUserId,
                        turfId: game.turfId,
                        courtType: game.courtType,
                        slotDate: game.slotDate,
                        startTime: game.startTime,
                        endTime: game.endTime,
                        pricePerPlayer: game.pricePerPlayer,
                        capacity: game.capacity,
                        status: game.status,
                        players: playersWithUser,
                        createdAt: game.createdAt
                            ? new Date(game.createdAt).toISOString()
                            : new Date().toISOString(),
                        updatedAt: game.updatedAt
                            ? new Date(game.updatedAt).toISOString()
                            : new Date().toISOString(),
                        turf: turf
                            ? {
                                turfName: turf.turfName,
                                location: turf.location,
                                images: turf.images,
                            }
                            : undefined,
                        hostUser: hostUser
                            ? {
                                name: hostUser.fullName,
                                email: hostUser.email,
                                phoneNumber: hostUser.phoneNumber,
                            }
                            : undefined,
                    });
                }
                return result;
            }
            catch (err) {
                console.error("❌ getUpComingGames repository error:", err);
                return [];
            }
        });
    }
    joinGame(gameId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const game = yield hosted_game_schema_1.HostedGameModel.findById(gameId);
            if (!game) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NOT_GAME_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (!game.players) {
                game.players = [];
            }
            const alreadyJoined = game.players.some((player) => player.userId === userId);
            if (alreadyJoined)
                return false;
            (_a = game.players) === null || _a === void 0 ? void 0 : _a.push({
                userId,
                status: "paid",
            });
            if (((_b = game.players) === null || _b === void 0 ? void 0 : _b.length) >= game.capacity) {
                game.status = "full";
            }
            yield game.save();
            return true;
        });
    }
    getHostedGameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield hosted_game_schema_1.HostedGameModel.findById(id).lean();
            if (!game)
                return null;
            const turf = yield turf_model_1.TurfModel.findById(game.turfId).lean();
            const hostUser = yield client_model_1.ClientModel.findOne({
                userId: game.hostUserId,
            }).lean();
            const playersWithUser = [];
            for (const player of game.players || []) {
                const playerUser = yield client_model_1.ClientModel.findOne({
                    userId: player.userId,
                }).lean();
                playersWithUser.push({
                    userId: player.userId,
                    status: player.status,
                    joinedAt: player.joinedAt,
                    user: playerUser
                        ? {
                            name: playerUser.fullName,
                            email: playerUser.email,
                            phoneNumber: playerUser.phoneNumber,
                        }
                        : null,
                });
            }
            return {
                _id: game._id.toString(),
                hostUserId: game.hostUserId,
                turfId: game.turfId,
                courtType: game.courtType,
                slotDate: game.slotDate,
                startTime: game.startTime,
                endTime: game.endTime,
                pricePerPlayer: game.pricePerPlayer,
                capacity: game.capacity,
                status: game.status,
                players: playersWithUser,
                createdAt: game.createdAt
                    ? new Date(game.createdAt).toISOString()
                    : new Date().toISOString(),
                updatedAt: game.updatedAt
                    ? new Date(game.updatedAt).toISOString()
                    : new Date().toISOString(),
                turf: turf
                    ? {
                        turfName: turf.turfName,
                        location: turf.location,
                        images: turf.images,
                    }
                    : undefined,
                hostUser: hostUser
                    ? {
                        name: hostUser.fullName,
                        email: hostUser.email,
                        phoneNumber: hostUser.phoneNumber,
                    }
                    : undefined,
            };
        });
    }
    findByTurfAndDateForOwner(turfId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return hosted_game_schema_1.HostedGameModel.find({
                turfId,
                slotDate: date,
                status: { $in: ["open", "full", "completed"] },
            }).lean();
        });
    }
    findBySlot(turfId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedstartTime = normalizeTime(startTime);
            const normalizedendtime = normalizeTime(endTime);
            const hostedGame = yield hosted_game_schema_1.HostedGameModel.findOne({
                turfId: turfId,
                slotDate: date,
                startTime: normalizedstartTime,
                endTime: normalizedendtime,
                status: { $ne: "cancelled" },
            });
            if (!hostedGame)
                return null;
            return hostedGame;
        });
    }
    findUpComingByUser(userId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const filter = {
                gameStartAt: { $gt: now },
                $or: [
                    { hostUserId: userId },
                    { "players.userId": userId },
                ]
            };
            if (search === null || search === void 0 ? void 0 : search.trim()) {
                filter.$and = [
                    {
                        $or: [
                            { courtType: { $regex: search, $options: "i" } },
                            { turfId: { $regex: search, $options: "i" } }
                        ]
                    }
                ];
            }
            const total = yield hosted_game_schema_1.HostedGameModel.countDocuments(filter);
            const games = yield hosted_game_schema_1.HostedGameModel.find(filter)
                .sort({ gameStartAt: 1 })
                .skip(skip)
                .limit(limit);
            return { games, total };
        });
    }
    updateStatusById(hostedGameId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield hosted_game_schema_1.HostedGameModel.findByIdAndUpdate(hostedGameId, {
                status
            });
        });
    }
    updateStatus(hostedGameId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.findByIdAndUpdate(hostedGameId, { status }, { new: true });
        });
    }
};
exports.HostGameRepository = HostGameRepository;
exports.HostGameRepository = HostGameRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], HostGameRepository);
const normalizeTime = (time) => {
    const [hourStr, period] = time.split(" ");
    let hour = parseInt(hourStr, 10);
    if (period === "PM" && hour !== 12)
        hour += 12;
    if (period === "AM" && hour === 12)
        hour = 0;
    return hour.toString().padStart(2, "0") + ":00";
};
