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
exports.AddMoneyOwnerWalletUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const ownerWallet_transaction_entity_1 = require("../../../domain/models/ownerWallet_transaction_entity");
const mongoose_1 = require("mongoose");
let AddMoneyOwnerWalletUseCase = class AddMoneyOwnerWalletUseCase {
    constructor(_bookingRepository, _turfRepository, _ownerWalletRepository, _ownerWalletTransactionRepository) {
        this._bookingRepository = _bookingRepository;
        this._turfRepository = _turfRepository;
        this._ownerWalletRepository = _ownerWalletRepository;
        this._ownerWalletTransactionRepository = _ownerWalletTransactionRepository;
    }
    execute(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findById(bookingId);
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const turf = yield this._turfRepository.findById(booking.turfId);
            if (!turf) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const ownerId = turf.ownerId;
            const wallet = yield this._ownerWalletRepository.findByOwnerId(ownerId);
            if (!wallet) {
                yield this._ownerWalletRepository.create(ownerId);
            }
            console.log('wallettt', wallet);
            yield this._ownerWalletRepository.incrementBalance(ownerId, booking.price);
            console.log('incrementttt');
            yield this._ownerWalletTransactionRepository.create({
                ownerId,
                turfId: new mongoose_1.Types.ObjectId(booking.turfId),
                bookingId: booking._id,
                amount: booking.price,
                type: ownerWallet_transaction_entity_1.OwnerWalletTransactionType.CREDIT,
                reason: "Booking payment credited",
                status: ownerWallet_transaction_entity_1.OwnerWalletTransactionStatus.SUCCESS,
                transactionDate: new Date(),
            });
            console.log('heyloooooo');
        });
    }
};
exports.AddMoneyOwnerWalletUseCase = AddMoneyOwnerWalletUseCase;
exports.AddMoneyOwnerWalletUseCase = AddMoneyOwnerWalletUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("ITurfRepository")),
    __param(2, (0, tsyringe_1.inject)("IOwnerWalletRepository")),
    __param(3, (0, tsyringe_1.inject)("IOwnerWalletTransactionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AddMoneyOwnerWalletUseCase);
