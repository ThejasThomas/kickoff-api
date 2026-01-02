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
exports.GetBookingsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const getBookingapper_1 = require("../../mappers/getBookingapper");
let GetBookingsUseCase = class GetBookingsUseCase {
    constructor(_bookingRepository, _hostedGameRepository, _turfOwnerRepository) {
        this._bookingRepository = _bookingRepository;
        this._hostedGameRepository = _hostedGameRepository;
        this._turfOwnerRepository = _turfOwnerRepository;
    }
    execute(turfId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!turfId || !date) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const ownerUserIds = yield this._turfOwnerRepository.getAllOwnerUserIds();
                const bookings = yield this._bookingRepository.findByTurfIdAndDate(turfId, date);
                const mappedBookings = (0, getBookingapper_1.mapBookingDTOList)(bookings).map((book) => {
                    const isOffline = ownerUserIds.includes(book.userId);
                    return {
                        _id: book._id,
                        turfId: book.turfId,
                        userId: book.userId,
                        startTime: book.startTime,
                        endTime: book.endTime,
                        date: book.date,
                        bookingType: isOffline ? "offline" : "normal",
                        price: book.price,
                        paymentStatus: book.paymentStatus === "completed" ? "completed" : "pending",
                        status: book.status,
                        createdAt: book.createdAt ? new Date(book.createdAt).toISOString() : new Date().toISOString(),
                    };
                });
                console.log('boookings', mappedBookings);
                const hostedGames = yield this._hostedGameRepository.findByTurfAndDateForOwner(turfId, date);
                const mappedHostedGames = hostedGames.map((game) => {
                    var _a, _b;
                    return ({
                        _id: game._id.toString(),
                        hostedGameId: game._id.toString(),
                        turfId: game.turfId,
                        userId: game.hostUserId,
                        startTime: game.startTime,
                        endTime: game.endTime,
                        date: game.slotDate,
                        bookingType: "hosted_game",
                        price: game.pricePerPlayer * (((_a = game.players) === null || _a === void 0 ? void 0 : _a.length) || 1),
                        status: game.status,
                        createdAt: new Date((_b = game.createdAt) !== null && _b !== void 0 ? _b : Date.now()).toISOString(),
                    });
                });
                return [...mappedBookings, ...mappedHostedGames];
            }
            catch (error) {
                console.error("Error in GetBookingsUseCase:", error);
                if (error instanceof custom_error_1.CustomError) {
                    throw error;
                }
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
};
exports.GetBookingsUseCase = GetBookingsUseCase;
exports.GetBookingsUseCase = GetBookingsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __param(2, (0, tsyringe_1.inject)("ITurfOwnerRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetBookingsUseCase);
