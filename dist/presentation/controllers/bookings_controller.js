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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.BookingsController = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let BookingsController = class BookingsController {
    constructor(_getBookingsUseCase, _getUpcomingBookingsUseCase, _getBookedTurfUseCase, _getPastBookingsUseCase, _requestCancelBookingUseCase, _handleOwnerCancelUseCase, _getCancellBookingsUseCase, _createHostedGameUseCase, _getUpcomingHostedGamesUseCase, _joinHostedGameUsecase, _getSingleHostedGameUseCase, _holdSlotUseCase, _getUpcomingHostedGamesByUser, _requesthostedGameCancellationUseCase) {
        this._getBookingsUseCase = _getBookingsUseCase;
        this._getUpcomingBookingsUseCase = _getUpcomingBookingsUseCase;
        this._getBookedTurfUseCase = _getBookedTurfUseCase;
        this._getPastBookingsUseCase = _getPastBookingsUseCase;
        this._requestCancelBookingUseCase = _requestCancelBookingUseCase;
        this._handleOwnerCancelUseCase = _handleOwnerCancelUseCase;
        this._getCancellBookingsUseCase = _getCancellBookingsUseCase;
        this._createHostedGameUseCase = _createHostedGameUseCase;
        this._getUpcomingHostedGamesUseCase = _getUpcomingHostedGamesUseCase;
        this._joinHostedGameUsecase = _joinHostedGameUsecase;
        this._getSingleHostedGameUseCase = _getSingleHostedGameUseCase;
        this._holdSlotUseCase = _holdSlotUseCase;
        this._getUpcomingHostedGamesByUser = _getUpcomingHostedGamesByUser;
        this._requesthostedGameCancellationUseCase = _requesthostedGameCancellationUseCase;
    }
    getAllbookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId, date } = req.query;
                if (typeof turfId !== "string" || typeof date !== "string") {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_TURFID_OR_DATE, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const bookings = yield this._getBookingsUseCase.execute(turfId, date);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
                    bookings,
                });
            }
            catch (error) {
                console.error("Error in getAllbookings", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                        bookings: [],
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "failed to fetch bookings",
                        bookings: [],
                    });
                }
            }
        });
    }
    getUpcomingbookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { page = 1, limit = 10, search = "" } = req.query;
                console.log("boookinguserIddd", userId);
                const pageNumber = Math.max(Number(page), 1);
                const pageSize = Math.max(Number(limit), 1);
                const searchTerm = typeof search === "string" ? search : "";
                if (!userId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.UNAUTHORIZED);
                }
                const { bookings, totalPages, total } = yield this._getUpcomingBookingsUseCase.execute(userId, pageNumber, pageSize, searchTerm);
                console.log("bookingssss", bookings);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY,
                    bookings,
                    totalPages,
                    total,
                    currentPage: pageNumber,
                });
            }
            catch (error) {
                console.error("Error in upcoming bookings", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                        bookings: [],
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Failed to fetch upcoming bookings",
                        bookings: [],
                    });
                }
            }
        });
    }
    getPastbookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 4;
                if (!userId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.UNAUTHORIZED);
                }
                const bookings = yield this._getPastBookingsUseCase.execute(userId, page, limit);
                res.status(constants_1.HTTP_STATUS.OK).json(Object.assign({ success: true, message: constants_1.SUCCESS_MESSAGES.BOOKINGS_FETCHED_SUCCESSFULLY }, bookings));
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                        bookings: [],
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Failed to fetch past bookings",
                        bookings: [],
                    });
                }
            }
        });
    }
    getTurfdetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId } = req.query;
                if (typeof turfId !== "string") {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const turfDetails = yield this._getBookedTurfUseCase.execute(turfId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.TURF_DETAILS_FETCHED_SUCCESSFULLY,
                    turfDetails,
                });
            }
            catch (error) {
                console.error("Error in getTurfdetails", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                        turfDetails: null,
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Failed to fetch turf details",
                        turfDetails: null,
                    });
                }
            }
        });
    }
    requestCancellation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const bookingId = req.params.bookingId;
                const { reason } = req.body;
                console.log("userIdd", userId + "    ", "bookingIs", bookingId);
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized",
                    });
                }
                if (!reason) {
                    res.status(400).json({
                        success: false,
                        message: "Cancellation reason is required",
                    });
                }
                const result = yield this._requestCancelBookingUseCase.execute(userId, bookingId, reason);
                res.status(200).json({
                    success: true,
                    message: "Cancellation request submitted successfully",
                    data: result,
                });
            }
            catch (err) {
                if (err instanceof custom_error_1.CustomError) {
                    res.status(err.statusCode || 400).json({
                        success: false,
                        message: err.message,
                    });
                }
            }
        });
    }
    handleOwnerCancelRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { requestId, userId } = req.params;
                const { action } = req.body;
                console.log("userrrIddddd", ownerId);
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                    return;
                }
                if (!requestId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.REQUEST_ID_REQUIRED,
                    });
                    return;
                }
                if (!["approved", "rejected"].includes(action)) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_ACTION,
                    });
                    return;
                }
                const result = yield this._handleOwnerCancelUseCase.execute(requestId, action, userId);
                res.status(200).json({
                    success: true,
                    message: result.message,
                });
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        messsage: error.message,
                    });
                    return;
                }
            }
        });
    }
    getCancelRequestBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 4;
                if (!ownerId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, constants_1.HTTP_STATUS.UNAUTHORIZED);
                    return;
                }
                const requests = yield this._getCancellBookingsUseCase.execute(ownerId, page, limit);
                console.log("requesttss", requests);
                res.status(200).json(Object.assign({ success: true, message: "Cancellation requests fetched successfully" }, requests));
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch cancellation requests",
                });
            }
        });
    }
    createGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { turfId, courtType, slotDate, startTime, endTime, pricePerPlayer, } = req.body;
                const result = yield this._createHostedGameUseCase.execute({
                    hostUserId: userId,
                    turfId,
                    courtType,
                    slotDate,
                    startTime,
                    endTime,
                    pricePerPlayer,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: "Game Hosted Successfully",
                    game: result,
                });
            }
            catch (err) {
                res.status(500).json({
                    success: false,
                    message: err.message || "Failed to Host game",
                });
            }
        });
    }
    getUpcomingHostedGames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "6", search = "", minPrice, maxPrice, } = req.query;
                const games = yield this._getUpcomingHostedGamesUseCase.execute({
                    page: Number(page),
                    limit: Number(limit),
                    search: search,
                    minPrice: minPrice ? Number(minPrice) : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) : undefined,
                });
                res.status(200).json({
                    success: true,
                    games,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch upcoming hosted games",
                });
            }
        });
    }
    joinHostedGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { gameId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!gameId || !userId) {
                    res.status(400).json({
                        success: false,
                        message: "Game ID and user ID required",
                    });
                    return;
                }
                const result = yield this._joinHostedGameUsecase.execute({
                    gameId,
                    userId,
                });
                res.status(200).json(result);
            }
            catch (err) {
                res.status(err.statusCode || 500).json({
                    success: false,
                    message: err.message || "Failed to join game",
                });
            }
        });
    }
    getSingleHostedGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log("idddd", id);
                const game = yield this._getSingleHostedGameUseCase.execute(id);
                res.status(200).json({
                    success: true,
                    game,
                });
            }
            catch (err) {
                res.status(err.statusCode || 500).json({
                    success: false,
                    message: err.message || "Failed to fetch hosted game",
                });
            }
        });
    }
    holdSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { turfId, date, startTime, endTime } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log("dataas", userId, date, startTime, endTime);
                yield this._holdSlotUseCase.execute(turfId, date, startTime, endTime, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Slot locked successfully",
                });
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                    return;
                }
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        });
    }
    getUpcomingHostedGamesByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { page = 1, limit = 10, search = "" } = req.query;
                if (!userId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.UNAUTHORIZED);
                }
                const result = yield this._getUpcomingHostedGamesByUser.execute(userId, Number(page), Number(limit), String(search));
                res.status(constants_1.HTTP_STATUS.OK).json(Object.assign(Object.assign({ success: true, message: constants_1.SUCCESS_MESSAGES.HOSTED_GAME_FETCHED_SUCCESSFULLY }, result), { currentPage: Number(page) }));
            }
            catch (error) {
                res
                    .status(error instanceof custom_error_1.CustomError
                    ? error.statusCode
                    : constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json({
                    success: false,
                    message: error instanceof custom_error_1.CustomError ? error.message : constants_1.ERROR_MESSAGES,
                    games: [],
                });
            }
        });
    }
    requestHostedGameCancellation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const hostedGameId = req.params.gameId;
                const { reason } = req.body;
                console.log('reason', reason);
                if (!userId) {
                    res
                        .status(401)
                        .json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                if (!reason) {
                    res.status(400).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.CANCELLATION_REASON_REQUIRED,
                    });
                    return;
                }
                const result = yield this._requesthostedGameCancellationUseCase.execute(userId, hostedGameId, reason);
                res.status(200).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.HOSTES_GAME_CANCELLATION_REQUESTED,
                    data: result,
                });
            }
            catch (err) {
                if (err instanceof custom_error_1.CustomError) {
                    res.status(err.statusCode).json({
                        success: false,
                        message: err.message,
                    });
                }
            }
        });
    }
};
exports.BookingsController = BookingsController;
exports.BookingsController = BookingsController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetBookingsUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetUpcomingBookingUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetBookedTurfUseCase")),
    __param(3, (0, tsyringe_1.inject)("IGetPastBookingsUseCase")),
    __param(4, (0, tsyringe_1.inject)("IRequestCancelBookingUseCase")),
    __param(5, (0, tsyringe_1.inject)("IHandlOwnerCancelRequestUseCase")),
    __param(6, (0, tsyringe_1.inject)("IGetCancelRequestsUseCase")),
    __param(7, (0, tsyringe_1.inject)("ICreateHostedGameUseCase")),
    __param(8, (0, tsyringe_1.inject)("IGetUpcomingHostedGamesUseCase")),
    __param(9, (0, tsyringe_1.inject)("IJoinHostedGameUseCase")),
    __param(10, (0, tsyringe_1.inject)("IGetSingleHostedGameUseCase")),
    __param(11, (0, tsyringe_1.inject)("IHoldSlotUseCase")),
    __param(12, (0, tsyringe_1.inject)("IGetUpcomingHostedGamesByUserUseCase")),
    __param(13, (0, tsyringe_1.inject)("IRequestHostedGameCancelUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], BookingsController);
