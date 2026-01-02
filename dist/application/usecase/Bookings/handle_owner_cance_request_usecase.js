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
exports.HandleOwnerCancelrequestUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const mongoose_1 = require("mongoose");
const ownerWallet_transaction_entity_1 = require("../../../domain/models/ownerWallet_transaction_entity");
let HandleOwnerCancelrequestUseCase = class HandleOwnerCancelrequestUseCase {
    constructor(_cancelRequestRepo, _bookingrepo, _walletRepository, _emailService, _clientRepository, _ownerWalletRepository, _ownerWalletTransactionRepository, _turfrepository, _hostedGameRepository) {
        this._cancelRequestRepo = _cancelRequestRepo;
        this._bookingrepo = _bookingrepo;
        this._walletRepository = _walletRepository;
        this._emailService = _emailService;
        this._clientRepository = _clientRepository;
        this._ownerWalletRepository = _ownerWalletRepository;
        this._ownerWalletTransactionRepository = _ownerWalletTransactionRepository;
        this._turfrepository = _turfrepository;
        this._hostedGameRepository = _hostedGameRepository;
    }
    execute(requestId, action, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const request = yield this._cancelRequestRepo.findById(requestId);
            console.log("reqqqqqqqq", request);
            console.log('action', action);
            console.log('request', request);
            if (request === null || request === void 0 ? void 0 : request.bookingId) {
                const booking = yield this._bookingrepo.findById(request.bookingId);
                console.log("bookings", booking);
                if (!booking) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                const user = yield this._clientRepository.findbyUserId(userId);
                console.log("userr", user);
                if (!user.email) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EMAIL_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                console.log("actionn", action);
                if (action === "rejected") {
                    yield this._bookingrepo.updateStatus(requestId, "rejected");
                    yield this._bookingrepo.updateStatusById(request.bookingId, "confirmed");
                    yield this._emailService.sendRejectionEmail(user.email, "Your cancellation request was rejected by turf owner.", "https://kickoffff.com/my-bookingssss", "Booking Cancellation");
                    return { message: "Cancellation rejected successfully" };
                }
                console.log("booking.turfid", booking.turfId);
                if (action === "approved") {
                    console.log("id", booking.userId);
                    console.log("price", booking.price);
                    yield this._walletRepository.addMoney(booking.userId, booking.price, "Cancellation refund");
                    console.log("bruuh moneyy added ");
                    const turf = yield this._turfrepository.findById(booking.turfId);
                    console.log("turffffIDDDDDDD", turf);
                    if (!turf) {
                        throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                    }
                    const ownerId = turf.ownerId;
                    console.log("iddOwnerrrrr", ownerId);
                    yield this._ownerWalletRepository.decrementBalance(ownerId, booking.price);
                    yield this._ownerWalletTransactionRepository.create({
                        ownerId,
                        turfId: new mongoose_1.Types.ObjectId(booking.turfId),
                        bookingId: booking._id,
                        amount: booking.price,
                        type: ownerWallet_transaction_entity_1.OwnerWalletTransactionType.DEBIT,
                        reason: "Booking cancellation refund",
                        status: ownerWallet_transaction_entity_1.OwnerWalletTransactionStatus.SUCCESS,
                        transactionDate: new Date(),
                    });
                    yield this._bookingrepo.updateStatus(requestId, "approved");
                    yield this._bookingrepo.updateStatusById(request.bookingId, "cancelled");
                    yield this._emailService.sendApprovalEmail(user.email, "Booking Cancellation Refund");
                    return { message: "Cancellation approved & refund issued" };
                }
                // throw new CustomError(
                //   ERROR_MESSAGES.INVALID_ACTION,
                //   HTTP_STATUS.BAD_REQUEST
                // );
            }
            if (request === null || request === void 0 ? void 0 : request.hostedGameId) {
                console.log('heyy');
                const game = yield this._hostedGameRepository.findById(request.hostedGameId);
                if (!game) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NOT_GAME_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                if (action === "rejected") {
                    yield this._hostedGameRepository.updateStatusById(request.hostedGameId, "open");
                    console.log('rejection');
                    yield this._cancelRequestRepo.updateStatus(requestId, "rejected");
                    console.log('status updated');
                    return { message: "Hosted game cancellation rejected" };
                }
                if (action === "approved") {
                    const turf = yield this._turfrepository.findById(game.turfId);
                    if (!turf) {
                        throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                    }
                    const ownerId = turf.ownerId;
                    const totalRefund = (((_a = game.players) === null || _a === void 0 ? void 0 : _a.length) || 0) * game.pricePerPlayer;
                    for (const player of game.players || []) {
                        const user = yield this._clientRepository.findbyUserId(player.userId);
                        if (!(user === null || user === void 0 ? void 0 : user.email))
                            continue;
                        yield this._walletRepository.addMoney(player.userId, game.pricePerPlayer, "Hosted game cancelled refund");
                        yield this._emailService.sendApprovalEmail(user.email, "Hosted game cancelled and refund issued");
                    }
                    yield this._ownerWalletRepository.decrementBalance(ownerId, totalRefund);
                    console.log('money deducted');
                    yield this._ownerWalletTransactionRepository.create({
                        ownerId,
                        turfId: new mongoose_1.Types.ObjectId(game.turfId),
                        bookingId: game._id,
                        amount: totalRefund,
                        type: ownerWallet_transaction_entity_1.OwnerWalletTransactionType.DEBIT,
                        reason: "Hosted game cancellation refund",
                        status: ownerWallet_transaction_entity_1.OwnerWalletTransactionStatus.SUCCESS,
                        transactionDate: new Date()
                    });
                    console.log('created');
                    yield this._hostedGameRepository.update({ _id: game._id }, {
                        status: "cancelled",
                        players: []
                    });
                    console.log('cancelled');
                    yield this._cancelRequestRepo.updateStatus(requestId, "approved");
                    return { message: "Hosted game cancelled & all players refunded" };
                }
                // if (!request?.bookingId) {
                //   throw new CustomError(
                //     ERROR_MESSAGES.REQUEST_NOT_FOUND,
                //     HTTP_STATUS.NOT_FOUND
                //   );
                // }
            }
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ACTION, constants_1.HTTP_STATUS.BAD_REQUEST);
        });
    }
};
exports.HandleOwnerCancelrequestUseCase = HandleOwnerCancelrequestUseCase;
exports.HandleOwnerCancelrequestUseCase = HandleOwnerCancelrequestUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ICancelRequestRepository")),
    __param(1, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(2, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(3, (0, tsyringe_1.inject)("IEmailService")),
    __param(4, (0, tsyringe_1.inject)("IClientRepository")),
    __param(5, (0, tsyringe_1.inject)("IOwnerWalletRepository")),
    __param(6, (0, tsyringe_1.inject)("IOwnerWalletTransactionRepository")),
    __param(7, (0, tsyringe_1.inject)("ITurfRepository")),
    __param(8, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], HandleOwnerCancelrequestUseCase);
