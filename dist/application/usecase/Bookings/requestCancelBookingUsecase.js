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
exports.RequestCancelBookingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let RequestCancelBookingUseCase = class RequestCancelBookingUseCase {
    constructor(_bookingRepository, _turfRepositoy, _cancelrequestRepository) {
        this._bookingRepository = _bookingRepository;
        this._turfRepositoy = _turfRepositoy;
        this._cancelrequestRepository = _cancelrequestRepository;
    }
    execute(userId, bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findById(bookingId);
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (booking.userId !== userId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, constants_1.HTTP_STATUS.UNAUTHORIZED);
            }
            const turf = yield this._turfRepositoy.getTurfById(booking.turfId);
            if (!turf) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const ownerId = turf.ownerId;
            if (!ownerId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.OWNER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const now = new Date();
            const startTime = new Date(`${booking.date}T${booking.startTime}`);
            const minutesDiff = (startTime.getTime() - now.getTime()) / 60000;
            if (minutesDiff < 60) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const exisitingrequest = yield this._cancelrequestRepository.findByBookingId(bookingId);
            if (exisitingrequest) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.REQUEST_ALREADY_SUBMITTED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._bookingRepository.updateStatusById(bookingId, "pending_cancel");
            const request = {
                bookingId,
                userId,
                ownerId,
                reason,
                status: "pending",
                createdAt: new Date()
            };
            return yield this._cancelrequestRepository.createRequest(request);
        });
    }
};
exports.RequestCancelBookingUseCase = RequestCancelBookingUseCase;
exports.RequestCancelBookingUseCase = RequestCancelBookingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("ITurfRepository")),
    __param(2, (0, tsyringe_1.inject)("ICancelRequestRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], RequestCancelBookingUseCase);
