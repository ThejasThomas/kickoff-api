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
exports.RequestCancelHostedGameUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let RequestCancelHostedGameUseCase = class RequestCancelHostedGameUseCase {
    constructor(_hostedGameRepository, _cancelRequestRepository, _turfRepository) {
        this._hostedGameRepository = _hostedGameRepository;
        this._cancelRequestRepository = _cancelRequestRepository;
        this._turfRepository = _turfRepository;
    }
    execute(userId, hostedGameId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._hostedGameRepository.findById(hostedGameId);
            if (!game) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NOT_GAME_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (game.hostUserId !== userId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, constants_1.HTTP_STATUS.UNAUTHORIZED);
            }
            if (["cancelled", "completed"].includes(game.status)) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const now = new Date();
            const startTime = new Date(`${game.slotDate}T${game.startTime}`);
            const diffMinutes = (startTime.getTime() - now.getTime()) / 60000;
            if (diffMinutes < 60) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CANCELLATION_NOT_ALLOWED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const turf = yield this._turfRepository.getTurfById(game.turfId);
            if (!turf) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            yield this._hostedGameRepository.updateStatusById(hostedGameId, "pending_cancel");
            const ownerId = turf.ownerId;
            const request = {
                hostedGameId,
                userId,
                ownerId,
                reason,
                status: "pending",
                createdAt: new Date()
            };
            return yield this._cancelRequestRepository.createRequest(request);
        });
    }
};
exports.RequestCancelHostedGameUseCase = RequestCancelHostedGameUseCase;
exports.RequestCancelHostedGameUseCase = RequestCancelHostedGameUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __param(1, (0, tsyringe_1.inject)("ICancelRequestRepository")),
    __param(2, (0, tsyringe_1.inject)("ITurfRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], RequestCancelHostedGameUseCase);
