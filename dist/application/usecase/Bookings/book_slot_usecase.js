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
exports.BookSlotUseCase = void 0;
// Updated BookSlotUseCase - Use CreateBookingInput and inject userId
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const getBookingapper_1 = require("../../mappers/getBookingapper");
let BookSlotUseCase = class BookSlotUseCase {
    constructor(_bookingRepository, _redisRepository) {
        this._bookingRepository = _bookingRepository;
        this._redisRepository = _redisRepository;
    }
    execute(bookData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("dataas", bookData, userId);
                const normalizedDate = this.formatToISODate(bookData.date);
                const isLockValid = yield this._redisRepository.verifyLock(bookData.turfId, normalizedDate, bookData.startTime, bookData.endTime, userId);
                if (!isLockValid) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SLOT_LOCK_EXPIRE_OR_INVALID, constants_1.HTTP_STATUS.CONFLICT);
                }
                const alreadyBooked = yield this._bookingRepository.findSlotBooking(bookData.turfId, normalizedDate, bookData.startTime, bookData.endTime);
                if (alreadyBooked) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SLOT_ALREADY_BOOKED, constants_1.HTTP_STATUS.CONFLICT);
                }
                const completeBooking = Object.assign(Object.assign({}, bookData), { date: normalizedDate, userId });
                console.log('complete', completeBooking);
                console.log("bookDaaaaataaaaaaaaaaaa", normalizedDate);
                const bookSlot = yield this._bookingRepository.save(completeBooking);
                yield this._redisRepository.releaseLock(bookData.turfId, normalizedDate, bookData.startTime, bookData.endTime, userId);
                return (0, getBookingapper_1.mapBookingDTO)(bookSlot);
            }
            catch (error) {
                console.error("Error in book slot use case ");
                if (error instanceof custom_error_1.CustomError) {
                    throw error;
                }
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_FAILED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    formatToISODate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
};
exports.BookSlotUseCase = BookSlotUseCase;
exports.BookSlotUseCase = BookSlotUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("ISlotLockRepository")),
    __metadata("design:paramtypes", [Object, Object])
], BookSlotUseCase);
