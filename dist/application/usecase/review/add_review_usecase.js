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
exports.AddReviewUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let AddReviewUseCase = class AddReviewUseCase {
    constructor(_reviewRepo, _bookingRepo) {
        this._reviewRepo = _reviewRepo;
        this._bookingRepo = _bookingRepo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, turfId, bookingId, comment } = data;
            console.log('comment', comment);
            const booking = yield this._bookingRepo.findById(bookingId);
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (booking.status !== "completed") {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.REVIEW_ONLY_COMPLETED_BOOKINGS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (booking.userId !== userId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, constants_1.HTTP_STATUS.FORBIDDEN);
            }
            const existingReview = yield this._reviewRepo.findByBookingId(bookingId);
            if (existingReview) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.REVIEW_ALREADY_SUBMITTED, constants_1.HTTP_STATUS.CONFLICT);
            }
            return this._reviewRepo.create({
                userId,
                turfId,
                bookingId,
                comment
            });
        });
    }
};
exports.AddReviewUseCase = AddReviewUseCase;
exports.AddReviewUseCase = AddReviewUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IReviewRepository")),
    __param(1, (0, tsyringe_1.inject)("IBookingRepository")),
    __metadata("design:paramtypes", [Object, Object])
], AddReviewUseCase);
