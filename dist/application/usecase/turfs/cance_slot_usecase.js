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
exports.CancelSlotUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let CancelSlotUseCase = class CancelSlotUseCase {
    constructor(_bookingRepo, _hostedGamerepo, _blockedSlotrepo, _walletRepo, _sendEmailUseCase, _clientrepo) {
        this._bookingRepo = _bookingRepo;
        this._hostedGamerepo = _hostedGamerepo;
        this._blockedSlotrepo = _blockedSlotrepo;
        this._walletRepo = _walletRepo;
        this._sendEmailUseCase = _sendEmailUseCase;
        this._clientrepo = _clientrepo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId, date, startTime, endTime } = data;
                const booking = yield this._bookingRepo.findSlotBooking(turfId, date, startTime, endTime);
                if (booking) {
                    const user = yield this._clientrepo.findbyUserId(booking.userId);
                    console.log("user-mail", user === null || user === void 0 ? void 0 : user.email);
                    if (!user || !user.email) {
                        throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                    }
                    yield this._walletRepo.addMoney(booking.userId, booking.price, "Slot Cancelled refund");
                    yield this._bookingRepo.updateStatusBookings({ _id: booking._id }, { status: "cancelled" });
                    yield this._sendEmailUseCase.execute(user.email, "Slot Cancelled & Refund Issued", `
          <h3>Your Slot Has Been Cancelled</h3>
          <p>Date: ${date}</p>
          <p>Time: ${startTime} - ${endTime}</p>
          <p>Refund Amount: ₹${booking.price}</p>
          <p>The amount has been credited to your wallet.</p>
        `);
                }
                const hostedGame = yield this._hostedGamerepo.findBySlot(turfId, date, startTime, endTime);
                if (hostedGame) {
                    for (const player of hostedGame.players || []) {
                        const user = yield this._clientrepo.findbyUserId(player.userId);
                        if (!user || !user.email)
                            continue;
                        yield this._walletRepo.addMoney(player.userId, hostedGame.pricePerPlayer, "Hosted game cancelled refund");
                        console.log('userrrrrrEmmail', user.email);
                        yield this._sendEmailUseCase.execute(user.email, "Hosted Game Cancelled", `
        <h3>Your Hosted Game Was Cancelled</h3>
        <p>Date: ${date}</p>
        <p>Time: ${startTime} - ${endTime}</p>
        <p>Refund Amount: ₹${hostedGame.pricePerPlayer}</p>
        <p>The refund has been credited to your wallet.</p>
      `);
                    }
                    console.log('hosteddId', hostedGame._id);
                    yield this._hostedGamerepo.update({ _id: hostedGame._id }, {
                        status: "cancelled",
                        players: []
                    });
                }
                yield this._blockedSlotrepo.create({
                    turfId,
                    date,
                    startTime,
                    endTime,
                    reason: "Owner cancelled slot",
                });
            }
            catch (error) {
                console.error(error);
                return;
            }
        });
    }
};
exports.CancelSlotUseCase = CancelSlotUseCase;
exports.CancelSlotUseCase = CancelSlotUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __param(2, (0, tsyringe_1.inject)("IBlockedSlotRepository")),
    __param(3, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(4, (0, tsyringe_1.inject)("ISendEmailUseCase")),
    __param(5, (0, tsyringe_1.inject)("IClientRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], CancelSlotUseCase);
